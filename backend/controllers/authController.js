import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

// ---------------- Utils ----------------
const createToken = (user) =>
    jwt.sign(
        { id: user._id, tenantId: user.tenantId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

const formatUserResponse = (user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    tenantId: user.tenantId,
});

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Missing credentials" });

        const user = await User.findOne({ email: email.toLowerCase() }).populate("tenantId").lean();

        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword)
            return res.status(401).json({ message: "Invalid credentials" });

        if (!user.isActive)
            return res.status(403).json({ message: "Account is inactive" });

        const token = createToken(user);
        return res.json({ token, user: formatUserResponse(user) });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ---------------- REGISTER ADMIN ----------------
export const registerAdmin = async (req, res) => {
    try {
        const { tenantName, tenantSlug, name, email, password } = req.body;
        if (!tenantName || !tenantSlug || !name || !email || !password)
            return res.status(400).json({ message: "Missing fields" });

        const existingTenant = await Tenant.findOne({ slug: tenantSlug }).lean();
        if (existingTenant)
            return res.status(400).json({ message: "Tenant slug already exists" });

        const tenant = await Tenant.create({
            name: tenantName,
            slug: tenantSlug,
            subscription: { plan: "free" },
        });

        const passwordHash = await bcrypt.hash(password, 10);
        const adminUser = await User.create({
            tenantId: tenant._id,
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: "admin",
        });

        const token = createToken(adminUser);
        return res.json({ token, user: formatUserResponse(adminUser) });
    } catch (error) {
        console.error("Register admin error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ---------------- GET USERS BY TENANT ----------------
export const getUsersByTenant = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Forbidden: Admin only" });

        const users = await User.find({ tenantId: req.user.tenantId })
            .select("id name email role isActive tenantId")
            .lean();

        return res.json({ users });
    } catch (error) {
        console.error("Get users error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admin only" });
        }

        if (req.user.id === userId) {
            return res.status(400).json({ message: "You cannot change your own status" });
        }

        const user = await User.findOne({ _id: userId, tenantId: req.user.tenantId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save();

        return res.json({
            message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
            user: formatUserResponse(user)
        });
    } catch (error) {
        console.error("Toggle user status error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ---------------- GET PROFILE ----------------
export const getProfile = (req, res) => {
    return res.json({ user: req.user, tenant: req.tenant, });
};
