import { Router } from "express";
import {
  bootstrapAdmin,
  currentUser,
  login,
  logout,
  register,
  requestPasswordReset,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/bootstrap-admin", bootstrapAdmin);
router.get("/me", requireAuth, currentUser);
router.post("/logout", requireAuth, logout);
router.post("/password-reset", requestPasswordReset);

export default router;
