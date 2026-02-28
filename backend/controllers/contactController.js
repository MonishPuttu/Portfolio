import { db } from "../db/db.js";
import { contacts } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { sendContactEmail } from "../services/emailService.js";

// Submit contact form
export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Save to database
    const newContact = await db
      .insert(contacts)
      .values({
        name,
        email,
        message,
        ipAddress,
        status: "new",
      })
      .returning();

    // Send email notification
    try {
      await sendContactEmail({ name, email, message });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again.",
    });
  }
};

// Get all contacts (admin)
export const getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;

    let allContacts;

    if (status) {
      allContacts = await db
        .select()
        .from(contacts)
        .where(eq(contacts.status, status))
        .orderBy(desc(contacts.createdAt));
    } else {
      allContacts = await db
        .select()
        .from(contacts)
        .orderBy(desc(contacts.createdAt));
    }

    res.json({ success: true, data: allContacts });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch contacts" });
  }
};

// Get contact by ID
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);

    if (contact.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Contact not found" });
    }

    res.json({ success: true, data: contact[0] });
  } catch (error) {
    console.error("Get contact error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch contact" });
  }
};

// Update contact status
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["new", "read", "replied", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const updated = await db
      .update(contacts)
      .set({ status })
      .where(eq(contacts.id, id))
      .returning();

    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Contact not found" });
    }

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Update contact error:", error);
    res.status(500).json({ success: false, error: "Failed to update contact" });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();

    if (deleted.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Contact not found" });
    }

    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({ success: false, error: "Failed to delete contact" });
  }
};
