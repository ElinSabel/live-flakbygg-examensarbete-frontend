import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendEmail = async (to: string, subject: string, html: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const logoUrl = "https://raw.githubusercontent.com/Medieinstitutet/fsu24d-systemutveckling-e-handel-f-r-prenumerationer-sevenisheaven/refs/heads/main/frontend/src/assets/logo.png";

const baseStyles = `
  font-family: Arial, sans-serif;
  color: #333;
  padding: 20px;
  line-height: 1.5;
`;

const emailWrapper = (title: string, content: string) => `
  <div style="${baseStyles}">
    <img src="${logoUrl}" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;" />
    <h1>${title}</h1>
    ${content}
    <p style="margin-top: 40px;">Kind regards,<br>FlakBygg Team</p>
  </div>
`;

export const sendConfirmationEmail = async (email: string, orderId: string, firstname = "Customer") => {
  const html = emailWrapper(
    `Order Confirmation ${orderId}!`,
    `<p>Hi ${firstname},</p>
     <p>Thank you for placing your order <strong>${orderId}</strong>. We're thrilled to make your dream come true.</p>
     <p>If you have any questions, feel free to contact us anytime.</p>`
  );

  const text = `Hi ${firstname}, thanks for your order ${orderId}. We're happy to have you with us!`;

  await sendEmail(email, `Order Confirmation – ${orderId}`, html, text);
};
