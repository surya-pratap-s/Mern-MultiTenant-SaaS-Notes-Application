import { Router } from "express";
import { login, registerAdmin, getUsersByTenant, getProfile, toggleUserStatus, } from "../controllers/authController.js";
import { auth, requireRole } from "../middlewares/auth.js";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/register", registerAdmin);

// Protected routes
router.get("/me", auth, getProfile);
router.get("/users", auth, requireRole("admin"), getUsersByTenant);
router.patch("/:userId/toggle-status", auth, requireRole("admin"), toggleUserStatus);

export default router;
