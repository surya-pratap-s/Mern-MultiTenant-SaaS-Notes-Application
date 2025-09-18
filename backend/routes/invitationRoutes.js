import express from "express";
import {
    inviteMember,
    getInvitations,
    resendInvitation,
    cancelInvitation,
    registerWithInvite,
} from "../controllers/invitationController.js";
import { auth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.post("/invite", auth, requireRole("admin"), inviteMember);
router.get("/", auth, requireRole("admin"), getInvitations);
router.post("/:id/resend", auth, requireRole("admin"), resendInvitation);
router.delete("/:id", auth, requireRole("admin"), cancelInvitation);

// user registration
router.post("/member", registerWithInvite);

export default router;
