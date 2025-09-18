import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ current user context
import API from "../api/api";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { Check, CheckSquare2, ChevronDown, Loader2, Search, XSquare } from "lucide-react";

const sortbyData = ["All", "Active", "Inactive"]

export default function MembersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortByOpen, setSortByOpen] = useState(false);
    const [sortBy, setSortBy] = useState("All");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/auth/users");
            setUsers(data.users);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (userId) => {
        try {
            const { data } = await API.patch(`/auth/${userId}/toggle-status`);
            toast.success(data.message);
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: !u.isActive } : u)));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update user");
        }
    };


    useEffect(() => { fetchUsers(); }, []);

    // --- Apply filters
    const filteredUsers = users
        .filter((u) =>
            u._id !== user?.id &&
            (
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())
            )
        )
        .filter((u) => {
            if (sortBy === "Active") return u.isActive;
            if (sortBy === "Inactive") return !u.isActive;
            return true;
        });

    return (
        <Layout>
            <div className="overflow-y-auto flex-1" style={{ height: "100vh", padding: "0 0 80px 0" }}>

                <div className="flex flex-row justify-between px-2 py-2">
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-3 top-3 text-white z-1" size={18} />
                        <input type="text" placeholder="Search user by name email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full border rounded focus:outline-none focus:border-white/5 bg-white/5 backdrop-blur-xl border-white/10"
                        />
                    </div>

                    <div className="w-40 relative">
                        <button onClick={() => setSortByOpen(!sortByOpen)} className="flex w-full items-center justify-between rounded-md bg-gray-800/50 py-2 px-3 text-left text-white border border-white/10 focus:ring-2 focus:ring-indigo-500">
                            <div className="flex items-center gap-3">
                                <span className="block truncate">{sortBy}</span>
                            </div>
                            <ChevronDown size={18} className={`transition-transform text-gray-400 ${sortByOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Dropdown Options */}
                        {sortByOpen && (
                            <div className="absolute z-10 mt-2 w-full rounded-md bg-gray-800 shadow-lg max-h-56 overflow-auto border border-white/10">
                                {sortbyData.map((i) => (
                                    <div key={i} onClick={() => { setSortBy(i); setSortByOpen(false); }} className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-white hover:bg-indigo-500 ${i.value === sortBy ? "bg-indigo-600" : ""}`}>
                                        <span className="flex-1 truncate">{i}</span>
                                        {sortBy === i && (
                                            <Check size={18} className="text-indigo-300" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Table --- */}
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-center text-gray-500">No users found</p>
                ) : (
                    <div className="overflow-x-auto bg-white/5 backdrop-blur-xl rounded border border-white/10 bg-gradient-to-b from-white/5 to-transparent mx-2">
                        <table className="min-w-full border-b border-gray-900 shadow">
                            <thead className="">
                                <tr>
                                    <th className="text-left p-3">Name</th>
                                    <th className="text-left p-3">Email</th>
                                    <th className="text-left p-3">Role</th>
                                    <th className="text-left p-3">Status</th>
                                    <th className="text-center p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="border-t hover:bg-gray-700 transition">
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3 capitalize">{user.role}</td>
                                        <td className="p-3 items-center">
                                            {user.isActive ? (<CheckSquare2 className="bg-green-500" />) : (<XSquare className="bg-red-300" />)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <label className="inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={user.isActive} onChange={() => handleToggle(user._id)} className="sr-only peer" />
                                                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}
