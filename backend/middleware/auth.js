import { createHash } from "node:crypto";
import Session from "../model/Session.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const session = await Session.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
    }).populate("user");

    if (!session?.user) {
      return res.status(401).json({ success: false, message: "Session is invalid or expired" });
    }

    req.user = session.user;
    req.sessionId = session._id;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "You do not have permission to perform this action" });
  }
  next();
};
