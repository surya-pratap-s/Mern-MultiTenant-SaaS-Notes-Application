import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tenant from "../models/Tenant.js";

export const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).populate("tenantId").select("-__v").lean();
        if (!user) return res.status(401).json({ message: "User not found" });

        const tenant = await Tenant.findById(user.tenantId).lean();
        if (!tenant) return res.status(400).json({ message: "Tenant not found" });

        req.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            tenantId: user.tenantId,
        };
        req.tenant = tenant;

        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(401).json({ message: "Unauthorized", detail: err.message });
    }
};

export const requireRole = (role) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== role) {
        return res.status(403).json({ message: `Forbidden: requires ${role}` });
    }
    next();
};
