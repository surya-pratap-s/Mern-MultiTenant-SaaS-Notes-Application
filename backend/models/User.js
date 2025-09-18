import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export default mongoose.model('User', UserSchema);
