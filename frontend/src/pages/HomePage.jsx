import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Search, ArrowUpDown, Filter, ChevronDown, Check, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const sortbyData = [
    { name: "Updated Date", value: "updatedAt" },
    { name: "Created Date", value: "createdAt" },
    { name: "Title", value: "title" },
    { name: "Member", value: "member" },
];

export default function HomePage() {
    const navigate = useNavigate();
    const { user, getNotes, deleteNote } = useAuth();
    const [isFilter, setIsFilter] = useState(false);
    const [isNoteDot, setIsNoteDot] = useState(null);
    const [sortByOpen, setSortByOpen] = useState(false);

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("updatedAt");
    const [order, setOrder] = useState("desc");

    // Fetch notes
    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await getNotes({ search, sortBy, order });
            if (res.success) setNotes(res.data);
            else toast.error(res.message || "Failed to fetch notes");
        } catch (err) {
            toast.error("Server error while fetching notes :", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNotes();
    }, [search, sortBy, order]);

    // Delete note handler
    const handleDelete = async (noteId) => {
        toast.info(
            <div className="flex flex-col">
                <span>Are you sure you want to delete this note?</span>
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={async () => {
                            try {
                                const res = await deleteNote(noteId);
                                if (res.success) {
                                    setNotes((prev) => prev.filter((n) => n._id !== noteId));
                                    toast.dismiss();
                                    toast.success("Note deleted successfully");
                                } else {
                                    toast.dismiss();
                                    toast.error(res.message || "Failed to delete note");
                                }
                            } catch (err) {
                                toast.dismiss();
                                toast.error(err.response?.data?.message || "Server error while deleting note");
                            }
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                        Yes, Delete
                    </button>
                    <button onClick={() => toast.dismiss()} className="px-3 py-1 bg-gray-500 text-white rounded text-sm">
                        Cancel
                    </button>
                </div>
            </div>,
            { autoClose: false, closeOnClick: false }
        );
    };
    console.log(notes);

    return (
        <Layout>
            <div className="overflow-y-auto flex-1" style={{ height: "100vh", padding: "0 0 80px 0" }}>
                {/* Search & Filter */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between gap-2">
                        <div className="relative w-full md:w-1/3">
                            <Search className="absolute left-3 top-3 text-white z-1" size={18} />
                            <input
                                type="text"
                                placeholder="Search notes by title..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-3 py-2 w-full border rounded focus:outline-none focus:border-white/5 bg-white/5 backdrop-blur-xl border-white/10"
                            />
                        </div>

                        <div className='flex gap-2'>
                            <div
                                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                                className={`px-2 py-1 border ${order === "asc" ? 'bg-white/3' : 'bg-white/9'} backdrop-blur-xl border-white/10`}
                            >
                                <ArrowUpDown className="h-5 w-5" />
                            </div>

                            {user?.role === "admin" && (
                                <div className='flex flex-col relative'>
                                    <div onClick={() => setIsFilter(!isFilter)} className='px-2 py-1 border bg-white/5 backdrop-blur-xl border-white/10'>
                                        <Filter className="h-5 w-5" />
                                    </div>
                                    {isFilter &&
                                        <div className="flex flex-wrap z-1 items-center gap-2 p-3 rounded absolute top-8 right-0 border bg-white/5 backdrop-blur-xl border-white/10">
                                            <div className="w-40 relative">
                                                <label className="block text-sm font-medium text-white mb-2">Sort By</label>
                                                <button onClick={() => setSortByOpen(!sortByOpen)} className="flex w-full items-center justify-between rounded-md bg-gray-800/50 py-2 px-3 text-left text-white border border-white/10 focus:ring-2 focus:ring-indigo-500">
                                                    <div className="flex items-center gap-3">
                                                        <span className="block truncate">{sortbyData.find(p => p.value === sortBy)?.name}</span>
                                                    </div>
                                                    <ChevronDown size={18} className={`transition-transform text-gray-400 ${sortByOpen ? "rotate-180" : ""}`} />
                                                </button>
                                                {sortByOpen && (
                                                    <div className="absolute z-10 mt-2 w-full rounded-md bg-gray-800 shadow-lg max-h-56 overflow-auto border border-white/10">
                                                        {sortbyData.map((i, index) => (
                                                            <div key={index} onClick={() => { setSortBy(i.value); setSortByOpen(false); }}
                                                                className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-white hover:bg-indigo-500 ${i.value === sortBy ? "bg-indigo-600" : ""}`}>
                                                                <span className="flex-1 truncate">{i.name}</span>
                                                                {sortBy === i.value && <Check size={18} className="text-indigo-300" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notes grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 p-4 gap-4'>
                    {loading ? (
                        <p className="text-gray-400">Loading...</p>
                    ) : notes.length === 0 ? (
                        <p className="text-gray-400">No notes found</p>
                    ) : (
                        notes.map((note, index) => (
                            <div key={index} className="p-4 rounded border hover:shadow-md transition-shadow cursor-pointer bg-white/5 backdrop-blur-xl border-white/10">
                                <div className="flex items-start justify-between mb-2 relative">
                                    <h4 className="font-medium text-gray-300 text-sm">{note.title}</h4>
                                    <MoreHorizontal onClick={() => setIsNoteDot(isNoteDot === index ? null : index)} className="h-4 w-4 text-gray-400" />
                                    {isNoteDot === index &&
                                        <div className='absolute gap-2 top-5 right-0 flex flex-col bg-white/10 backdrop-blur-2xl border-white/10 border py-1 px-2 rounded'>
                                            {note.authorId._id === user?.id &&
                                                <Edit onClick={() => navigate(`/note-create/${note._id}`)} className='w-4 h-4 text-blue-500' />
                                            }
                                            <Trash2 className='w-4 h-4 text-red-500' onClick={() => handleDelete(note._id)} />
                                        </div>
                                    }
                                </div>
                                <p className="text-xs text-gray-600 mb-3">
                                    {note.sub || note.content?.slice(0, 80) || "No description"}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-300">{note.authorId.email || "Unknown"}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}
