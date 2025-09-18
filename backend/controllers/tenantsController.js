import Tenant from "../models/Tenant.js";

export const upgrade = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Only admin can upgrade" });
        }

        const tenant = await Tenant.findById(req.user.tenantId);
        if (!tenant) {
            return res.status(404).json({ success: false, message: "Tenant not found" });
        }

        tenant.subscription.plan = "pro";
        await tenant.save();

        res.json({
            success: true,
            message: "Tenant upgraded to Pro successfully",
            tenant,
        });
    } catch (err) {
        console.error("Error upgrading tenant:", err);
        res.status(500).json({ success: false, message: "Server error", detail: err.message });
    }
};


export const getTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.user.tenantId).lean();
        if (!tenant) {
            return res.status(404).json({ success: false, message: "Tenant not found" });
        }

        res.json({ success: true, tenant });
    } catch (err) {
        console.error("Error fetching tenant:", err);
        res.status(500).json({ success: false, message: "Server error", detail: err.message });
    }
};


export const getAllTenants = async (req, res) => {
    try {
        // if (req.user.role !== "super-admin") {
        //     return res.status(403).json({ success: false, message: "Only super-admin can view all tenants" });
        // }

        const tenants = await Tenant.find().select("-__v").lean();
        res.json({ success: true, count: tenants.length, tenants });
    } catch (err) {
        console.error("Error fetching tenants:", err);
        res.status(500).json({ success: false, message: "Server error", detail: err.message });
    }
};
