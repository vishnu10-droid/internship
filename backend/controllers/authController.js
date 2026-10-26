import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import User from "../model/User.js";
import Session from "../model/Session.js";

const scrypt = promisify(scryptCallback);
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);

const publicUser = (user) => ({
  id: user._id.toString(),
  email: user.email,
  user_metadata: { role: user.role, full_name: user.full_name },
});

const issueSession = async (user) => {
  const token = randomBytes(32).toString("hex");
  await Session.create({
    user: user._id,
    tokenHash: createHash("sha256").update(token).digest("hex"),
    expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
  });
  return { access_token: token, token_type: "bearer", expires_in: SESSION_DAYS * 86400 };
};

const hashPassword = async (password) => {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
};

const passwordMatches = async (password, savedHash) => {
  const [salt, expectedHex] = savedHash.split(":");
  const expected = Buffer.from(expectedHex, "hex");
  const actual = await scrypt(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};

const sendAuthResponse = async (res, user, status = 200) => {
  const session = await issueSession(user);
  res.status(status).json({
    success: true,
    data: { user: publicUser(user), session: { ...session, user: publicUser(user) } },
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, role = "patient" } = req.body;
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "A valid email is required" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must contain at least 8 characters" });
    }
    if (typeof full_name !== "string" || !full_name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }
    if (!["patient", "physiotherapist"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid account role" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    const user = await User.create({
      email: normalizedEmail,
      full_name: full_name.trim(),
      role,
      passwordHash: await hashPassword(password),
    });
    await sendAuthResponse(res, user, 201);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await passwordMatches(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    await sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export const bootstrapAdmin = async (req, res, next) => {
  try {
    const setupKey = process.env.ADMIN_SETUP_KEY;
    if (!setupKey || req.get("x-admin-setup-key") !== setupKey) {
      return res.status(403).json({ success: false, message: "Admin setup is not authorized" });
    }
    if (await User.exists({ role: "admin" })) {
      return res.status(409).json({ success: false, message: "An admin account already exists" });
    }

    const { email, password, full_name } = req.body;
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "A valid email is required" });
    }
    if (typeof password !== "string" || password.length < 12) {
      return res.status(400).json({ success: false, message: "Admin password must contain at least 12 characters" });
    }
    if (typeof full_name !== "string" || !full_name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }

    const user = await User.create({
      email: email.trim().toLowerCase(),
      full_name: full_name.trim(),
      role: "admin",
      passwordHash: await hashPassword(password),
    });
    await sendAuthResponse(res, user, 201);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }
    next(error);
  }
};

export const currentUser = (req, res) => {
  res.json({ success: true, data: { user: publicUser(req.user) } });
};

export const logout = async (req, res, next) => {
  try {
    await Session.deleteOne({ _id: req.sessionId });
    res.json({ success: true, message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = (req, res) => {
  res.status(501).json({
    success: false,
    message: "Password reset email delivery is not configured",
  });
};
