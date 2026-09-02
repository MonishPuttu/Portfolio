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
    // `from` has to stay the authenticated SMTP account, so without replyTo
    // hitting Reply on the notification just mails yourself.
    replyTo: name ? `"${String(name).replace(/"/g, "'")}" <${email}>` : email,
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

/**
 * Notify the owner that someone visited.
 *
 * Sent once per visit, when the visit ends, so it can report how long they
 * stayed and what they looked at — the two things that turn "someone viewed
 * your portfolio" into something worth reading.
 *
 * Development is silent by default. A dev server reloading on every save
 * would otherwise mail you a few dozen times an afternoon, and the mail you
 * stop reading is the mail that does not work. Set VIEW_NOTIFICATIONS=on to
 * force it anywhere, or =off to silence production.
 */
export const sendVisitNotification = async (visit) => {
  const override = (process.env.VIEW_NOTIFICATIONS || "").toLowerCase();
  const enabled =
    override === "on"
      ? true
      : override === "off"
        ? false
        : process.env.NODE_ENV === "production";

  if (!enabled) {
    console.log(
      `[analytics] visit notification suppressed (NODE_ENV=${
        process.env.NODE_ENV || "development"
      }): ${visit.summaryLine}`,
    );
    return { sent: false, reason: "disabled-in-this-environment" };
  }

  if (!process.env.ADMIN_EMAIL) {
    console.warn("[analytics] ADMIN_EMAIL is not set; skipping notification.");
    return { sent: false, reason: "no-admin-email" };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: visit.subject,
    text: visit.text,
    html: visit.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { sent: true };
  } catch (error) {
    // Never let a mail failure take down a tracking request.
    console.error("Visit notification error:", error);
    return { sent: false, reason: error.message };
  }
};
