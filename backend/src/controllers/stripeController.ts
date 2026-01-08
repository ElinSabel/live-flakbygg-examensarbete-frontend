import Stripe from "stripe";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { CamperRequest } from "../models/CamperRequest";
import { Order } from "../models/Order";
import { sendConfirmationEmail } from "../utilities/emailServices";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "Missing requestId" });
    }

    const request = await CamperRequest.findById(requestId).populate<{
      customerId: { email: string; _id: string };
    }>("customerId");

    if (!request) return res.status(404).json({ error: "Request not found" });
    if (!request.agreedPrice || request.agreedPrice <= 0)
      return res.status(400).json({ error: "No agreed price set" });
    if (request.status === "paid")
      return res.status(400).json({ error: "Request already paid" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode:'embedded',
      payment_method_types: ["card"],
      customer_email: request.customerId.email,

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "sek",
            unit_amount: Math.round(request.agreedPrice * 100),
            product_data: {
              name: "Custom Camper Build",
              description: `Request ID: ${request._id}`,
            },
          },
        },
      ],

      metadata: {
        requestId: request._id.toString(),
        customerId: request.customerId._id.toString(),
        customerEmail: request.customerId.email,
        sellerId: request.sellerId?.toString() || "",
      },

      return_url: `${process.env.CLIENT_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({
      clientSecret: session.client_secret,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};


export const getSession = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Missing session ID" });

  try {
    const session = await stripe.checkout.sessions.retrieve(id);

    res.json({
      email: session.customer_email,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      requestId: session.metadata?.requestId,
      status: session.payment_status,
    });
  } catch (error: any) {
    console.error("Failed to retrieve session:", error);
    res.status(500).json({ error: error.message });
  }
};

export const webhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.error("Missing Stripe signature header");
    return res.status(400).send("Missing Stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const requestId = session.metadata?.requestId;
      if (!requestId) {
        console.warn("No requestId in metadata");
        return res.json({ received: true });
      }

      const request = await CamperRequest.findById(requestId);
      if (!request) {
        console.warn("CamperRequest not found:", requestId);
        return res.json({ received: true });
      }

      if (request.status === "paid") {
        return res.json({ received: true });
      }


      const order = await Order.create({
        requestId: request._id,
        customerId: request.customerId,
        sellerId: request.sellerId || null,
        amount: (session.amount_total || 0) / 100,
        stripePaymentIntentId: session.payment_intent as string,
        status: "created",
      });


      if (session.metadata?.customerEmail) {
        await sendConfirmationEmail(session.metadata.customerEmail, order._id.toString());
      }

      request.status = "paid";
      await request.save();
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handling error:", error.message);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};
