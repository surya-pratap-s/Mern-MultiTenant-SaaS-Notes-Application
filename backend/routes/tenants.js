import express from "express";
import { auth, requireRole } from "../middlewares/auth.js";
import { getAllTenants, getTenant, upgrade } from "../controllers/tenantsController.js";

const router = express.Router();

router.get("/me", auth, getTenant);
router.post("/:slug/upgrade", auth, requireRole("admin"), upgrade);
router.get("/", getAllTenants);

export default router;