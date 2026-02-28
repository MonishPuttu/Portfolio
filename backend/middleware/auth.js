import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "⚠️  JWT_SECRET is not set. Admin routes will be inaccessible.",
  );
}

/**
 * Middleware to verify JWT token for admin routes.
 * Expects: Authorization: Bearer <token>
 */
export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
};

/**
 * Generate a JWT token for admin login.
 */
export const generateAdminToken = (adminId) => {
  return jwt.sign({ id: adminId, role: "admin" }, JWT_SECRET, {
    expiresIn: "24h",
  });
};
