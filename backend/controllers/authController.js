import bcrypt from "bcryptjs";
import { generateAdminToken } from "../middleware/auth.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Admin login endpoint.
 * Uses environment variables for credentials (single admin user).
 * In production, replace with a proper user table.
 */
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminUsername || !adminPasswordHash) {
      console.error("Admin credentials not configured in environment");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
      });
    }

    if (username !== adminUsername) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = generateAdminToken(username);

    res.json({
      success: true,
      token,
      expiresIn: "24h",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};
