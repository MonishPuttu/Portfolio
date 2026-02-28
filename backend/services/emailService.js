import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Escape HTML special characters to prevent HTML injection.
 */
const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const smtpPort = parseInt(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  requireTLS: smtpPort !== 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendContactEmail = async (contactData) => {
  const { name, email, message } = contactData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission from ${escapeHtml(name)}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #8B5CF6; margin-bottom: 20px;">New Contact Form Submission</h2>
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Name:</strong>
            <p style="margin: 5px 0; color: #666;">${escapeHtml(name)}</p>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Email:</strong>
            <p style="margin: 5px 0; color: #666;">${escapeHtml(email)}</p>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #333;">Message:</strong>
            <p style="margin: 5px 0; color: #666; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999;">Sent from your portfolio contact form</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

export const sendViewNotification = async (viewData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: "New Portfolio View",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3 style="color: #8B5CF6;">Someone viewed your portfolio!</h3>
        <p><strong>Time:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
        <p><strong>Page:</strong> ${escapeHtml(viewData.page)}</p>
        <p><strong>Location:</strong> ${escapeHtml(viewData.location || "Unknown")}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("View notification error:", error);
  }
};
