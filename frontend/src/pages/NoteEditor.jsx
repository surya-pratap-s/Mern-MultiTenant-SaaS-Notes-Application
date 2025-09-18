import React, { useState, useEffect } from "react";
import { Save, FileText, BookOpen, Edit3 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function NoteEditor() {
    const { createNote, updateNote, getNoteById } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({ title: "", sub: "", content: "" });
    const [loading, setLoading] = useState(false);

    // Fetch note if edit mode
    useEffect(() => {
        const fetchNote = async () => {
            if (!id) return;
            setLoading(true);
            const note = await getNoteById(id);
            if (note) {
                setForm({
                    title: note.title || "",
                    sub: note.sub || "",
                    content: note.content || "",
                });
            }
            setLoading(false);
            console.log(note);
        };
        fetchNote();
    }, [id, getNoteById]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateNote(id, form);
            } else {
                await createNote(form);
            }
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Layout>
            <div className="overflow-y-auto flex-1" style={{ height: "100vh", padding: "0 0 80px 0" }}>
                {/* Header */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex flex-col sm:flex-row justify-between px-2 py-2">
                    <div className="flex  items-center justify-center">
                        {id ? (
                            <Edit3 className="w-6 h-6 text-blue-500 mr-3" />
                        ) : (
                            <FileText className="w-6 h-6 text-blue-500 mr-3" />
                        )}
                        <h1 className="text-xl font-bold text-gray-300">
                            {id ? "Edit Note" : "Create New Note"}
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base text-center">
                        {id
                            ? "Update your note with the latest changes"
                            : "Capture your thoughts and ideas in a beautifully crafted note"}
                    </p>
                </div>

                {/* Main Form Card */}
                <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent m-2">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4">
                        <div className="flex items-center text-white">
                            <BookOpen className="w-5 h-5 mr-2" />
                            <span className="font-semibold">Note Details</span>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-300">
                                <FileText className="w-4 h-4 mr-2 text-gray-300" />Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={form.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                required
                                placeholder="Enter your note title..."
                                className="w-full px-4 py-2 bg-white/5 backdrop-blur-xl border rounded border-white/10 bg-gradient-to-b from-white/5 to-transparent"
                            />
                        </div>

                        {/* Subject Field */}
                        <div className="space-y-2">
                            <label htmlFor="subject" className="flex items-center text-sm font-semibold text-gray-300">
                                <BookOpen className="w-4 h-4 mr-2 text-green-300" />Subject
                            </label>
                            <input
                                id="subject"
                                type="text"
                                value={form.sub}
                                onChange={(e) => handleChange("sub", e.target.value)}
                                required
                                placeholder="What's this note about?"
                                className="w-full px-4 py-2 bg-white/5 backdrop-blur-xl border rounded border-white/10 bg-gradient-to-b from-white/5 to-transparent"
                            />
                        </div>

                        {/* Content Field */}
                        <div className="space-y-2">
                            <label htmlFor="content" className="flex items-center text-sm font-semibold text-gray-300">
                                <Edit3 className="w-4 h-4 mr-2 text-purple-300" />Content
                            </label>
                            <div className="relative">
                                <textarea
                                    id="content"
                                    value={form.content}
                                    onChange={(e) => handleChange("content", e.target.value)}
                                    rows={12}
                                    required
                                    placeholder="Start writing your note content here..."
                                    className="w-full px-4 py-2 bg-white/5 backdrop-blur-xl border rounded border-white/10 bg-gradient-to-b from-white/5 to-transparent"
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                    {form.content.length} characters
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg">
                                {loading ? (<>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>) : (<>
                                    <Save className="w-4 h-4 mr-2" />
                                    {id ? "Update Note" : "Create Note"}
                                </>)}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
