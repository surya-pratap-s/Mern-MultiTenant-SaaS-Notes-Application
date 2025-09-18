import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    sub: { type: String, required: "" },
    content: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Note', NoteSchema);
