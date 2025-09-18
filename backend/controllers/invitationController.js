import bcrypt from "bcryptjs";
import Invitation from "../models/Invitation.js";
import { sendInvitationEmail } from "../config/mailer.js";
import User from "../models/User.js";

// Send Invitation (Admin only)
export const inviteMember = async (req, res) => {
    try {
        const { email } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can invite members" });
        }

        const invitation = new Invitation({
            email,
            role: "member",
            tenantId: req.user.tenantId,
            inviter: req.user.id,
        });

        await invitation.save();
        await sendInvitationEmail(email, invitation.referralCode);

        res.json({ message: "Invitation sent", invitation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View all invitations
export const getInvitations = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can view invitations" });
        }

        const invitations = await Invitation.find({ tenantId: req.user.tenantId })
            .populate("inviter", "name email")
            .sort({ createdAt: -1 });

        res.json(invitations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Resend invitation
export const resendInvitation = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can resend invitations" });
        }

        const invitation = await Invitation.findOne({
            _id: req.params.id,
            tenantId: req.user.tenantId,
            isUsed: false,
        });

        if (!invitation) {
            return res.status(404).json({ error: "Invitation not found or already used" });
        }

        invitation.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        await invitation.save();

        await sendInvitationEmail(invitation.email, invitation.referralCode);

        res.json({ message: "Invitation resent" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel invitation
export const cancelInvitation = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can cancel invitations" });
        }

        const invitation = await Invitation.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.user.tenantId,
            isUsed: false,
        });

        if (!invitation) {
            return res.status(404).json({ error: "Invitation not found or already used" });
        }

        res.json({ message: "Invitation cancelled" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Register with invitation
export const registerWithInvite = async (req, res) => {
    try {
        const { name, email, password, referralCode } = req.body;

        const invitation = await Invitation.findOne({ referralCode, email, isUsed: false });

        if (!invitation || invitation.expiresAt < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired invitation" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            passwordHash,
            role: invitation.role,
            tenantId: invitation.tenantId,
        });

        await user.save();
        invitation.isUsed = true;
        await invitation.save();

        res.json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
