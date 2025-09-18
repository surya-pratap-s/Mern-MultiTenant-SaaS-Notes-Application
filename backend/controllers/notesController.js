import mongoose from "mongoose";
import Note from "../models/Note.js";

const handleError = (res, err, msg = "Server error") => {
    console.error(msg, err);
    return res.status(500).json({ success: false, message: msg });
};

const validateNoteInput = ({ title }) => {
    if (!title || typeof title !== "string" || title.trim().length === 0) {
        return "Title is required and must be a string";
    }
    return null;
};

export const createNote = async (req, res) => {
    try {
        const validationError = validateNoteInput(req.body);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const { title, sub = "", content = "" } = req.body;
        const tenant = req.tenant;

        // enforce tenant subscription limit
        if (tenant.subscription.plan === "free") {
            const count = await Note.countDocuments({ tenantId: tenant._id });
            if (count >= 3) {
                return res.status(403).json({
                    success: false,
                    message: "Free plan limit reached. Upgrade to Pro.",
                });
            }
        }

        const note = await Note.create({
            tenantId: req.user.tenantId,
            authorId: req.user.id,
            title: title.trim(),
            sub: sub.trim(),
            content: content.trim(),
        });

        return res.status(201).json({ success: true, data: note });
    } catch (err) {
        return handleError(res, err, "Error creating note");
    }
};

export const listNotes = async (req, res) => {
    try {
        const filter = { tenantId: req.user.tenantId };
        if (req.user.role === "member") filter.authorId = req.user.id;

        const { search = "", sortBy = "updatedAt", order = "desc" } = req.query;

        if (search.trim()) {
            filter.title = { $regex: search.trim(), $options: "i" };
        }

        let sort = {};
        sort[sortBy] = order === "asc" ? 1 : -1;

        const notes = await Note.find(filter).populate("authorId").sort(sort).lean();

        return res.json({ success: true, count: notes.length, data: notes });
    } catch (err) {
        return handleError(res, err, "Error fetching notes");
    }
};


export const getNote = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid note ID" });
        }

        const note = await Note.findById(id).lean();
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        if (note.tenantId.toString() !== req.tenant._id.toString()) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        if (req.user.role === "member" && note.authorId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        return res.json({ success: true, note: note });
    } catch (err) {
        return handleError(res, err, "Error fetching note");
    }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid note ID" });
        }

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ success: false, message: "Note not found" });

        if (note.tenantId.toString() !== req.tenant._id.toString()) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        if (note.authorId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        const { title, content, sub } = req.body;
        if (title && title.trim()) note.title = title.trim();
        if (typeof content === "string") note.content = content.trim();
        if (typeof sub === "string") note.sub = sub.trim();
        note.updatedAt = new Date();

        await note.save();
        return res.json({ success: true, data: note });
    } catch (err) {
        return handleError(res, err, "Error updating note");
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid note ID" });
        }

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ success: false, message: "Note not found" });

        if (note.tenantId.toString !== req.tenant._id.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden: Tenant mismatch" });
        }

        if (req.user.role === "member" && note.authorId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden: Not the author" });
        }

        await note.deleteOne();
        return res.json({ success: true, message: "Note deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ success: false, message: "Error deleting note" });
    }
};

