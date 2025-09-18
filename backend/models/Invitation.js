import mongoose from "mongoose";
import crypto from "crypto";

const InvitationSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    inviter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    referralCode: { type: String, unique: true },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, default: () => Date.now() + 1000 * 60 * 60 * 24 * 7 },
}, { timestamps: true });

// InvitationSchema.pre("save", function (next) {
//     if (!this.referralCode) {
//         this.referralCode = crypto.randomBytes(16).toString("hex");
//     }
//     next();
// });

InvitationSchema.pre("save", function (next) {
    if (!this.referralCode) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 16; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Format into 4 groups of 4 (e.g., XXXX XXXX XXXX XXXX)
        this.referralCode = code.match(/.{1,4}/g).join(" ");
    }
    next();
});


export default mongoose.model("Invitation", InvitationSchema);
