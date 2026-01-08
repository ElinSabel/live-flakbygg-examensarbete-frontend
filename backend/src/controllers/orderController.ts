import { Request, Response } from "express";
import { Order } from "../models/Order";

export const orderController = {
  getOrderById: async (req: Request, res: Response) => {
    try {
      const found = await Order.findById(req.params.id)
        .populate("customerId")
        .populate("requestId")
        .populate("sellerId");

      if (!found) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(found);
    } catch (err) {
      res.status(400).json({ error: "Invalid order ID", details: err });
    }
  },

  getOrdersByCustomer: async (req: Request, res: Response) => {
    try {
      const orders = await Order.find({
        customerId: req.params.customerId,
      });

      res.json(orders);
    } catch (err) {
      res.status(400).json({ error: "Invalid customer ID", details: err });
    }
  },

  getAllOrders: async (_req: Request, res: Response) => {
    try {
      const orders = await Order.find()
        .populate({
          path: "customerId",
          select:
            "-password -refreshToken -passwordResetToken -passwordResetExpires",
        })
        .populate({
          path: "sellerId",
          select: "firstname lastname email role",
        })
        .populate({
          path: "requestId"
        });

      res.json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const updated = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Could not update order", details: err });
    }
  },

  updateOrder: async (req: Request, res: Response) => {
    try {
      const updated = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ) .populate("customerId")
      .populate("requestId")
      .populate("sellerId");


      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Failed to update order", details: err });
    }
  },

  deleteOrder: async (req: Request, res: Response) => {
    try {
      const deleted = await Order.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ message: "Order deleted successfully" });}

    catch (err) {
      res.status(400).json({ error: "Failed to delete order", details: err });
    }
  },
};
