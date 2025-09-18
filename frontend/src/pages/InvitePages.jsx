import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
// Import icons from lucide-react
import { Send, Mail, RefreshCw, XCircle, Loader2 } from 'lucide-react';

export default function InvitePages() {
    const { invitations, handleInvite, handleResend, handleCancel } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState({ id: null, type: null });


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await handleInvite({ email });
        setEmail("");
        setLoading(false);
    };

    const handleResendLoading = async (id) => {
        setLoadingAction({ id, type: "resend" });
        try {
            await handleResend(id);
        } finally {
            setLoadingAction({ id: null, type: null });
        }
    };

    const handleCancelLoading = async (id) => {
        setLoadingAction({ id, type: "cancel" });
        try {
            await handleCancel(id);
        } finally {
            setLoadingAction({ id: null, type: null });
        }
    };


    return (
        <Layout>
            <div className="overflow-y-auto flex-1" style={{ height: "100vh", padding: "0 0 80px 0" }}>
                <div className="p-6 md:p-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        {/* Email Input with Icon */}
                        <div className="relative flex-1">
                            <Mail className="h-5 w-5 text-gray-400 absolute top-1/2 left-4 transform -translate-y-1/2" />
                            <input
                                type="email"
                                placeholder="Enter member email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="items-center justify-center bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300">
                            {loading ? <Loader2 className='h-5 w-5 animate-spin' /> : <Send className="h-5 w-5" />}
                        </button>
                    </form>
                </div>

                {/* ## Invitations List Card ## */}
                <div className="shadow-lg overflow-hidden border bg-white/5 backdrop-blur-xl border-white/10 mx-2">
                    <div className="p-4 border-b border-gray-500 shadow flex flex-col sm:flex-row justify-between">
                        <h3 className="text-xl font-bold text-gray-400">Invitation History</h3>
                        <p className="text-gray-500 mt-1">Manage all pending and accepted invitations.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-300 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Code</th>
                                    <th scope="col" className="px-6 py-3">Role</th>
                                    <th scope="col" className="px-6 py-3">Invited By</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='text-xs text-gray-300'>
                                {invitations.map((inv) => (
                                    <tr key={inv._id} className="bg-white/5 backdrop-blur-xl border-white/10 border-b hover:bg-gray-500 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900">{inv.email}</td>
                                        <td className="px-6 py-4 capitalize">{inv.referralCode}</td>
                                        <td className="px-6 py-4 capitalize">{inv.role}</td>
                                        <td className="px-6 py-4">{inv.inviter?.name || "—"}</td>
                                        <td className="px-6 py-4">
                                            {inv.isUsed ? (
                                                <span className="px-2.5 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Accepted</span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-4">
                                                {!inv.isUsed ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleResendLoading(inv._id)}
                                                            disabled={loadingAction.id === inv._id && loadingAction.type === "resend"}
                                                            className="text-blue-500 hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Resend Invitation"
                                                        >
                                                            {loadingAction.id === inv._id && loadingAction.type === "resend" ? (
                                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                            ) : (
                                                                <RefreshCw className="h-5 w-5" />
                                                            )}
                                                        </button>

                                                        <button
                                                            onClick={() => handleCancelLoading(inv._id)}
                                                            disabled={loadingAction.id === inv._id && loadingAction.type === "cancel"}
                                                            className="text-red-500 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Cancel Invitation"
                                                        >
                                                            {loadingAction.id === inv._id && loadingAction.type === "cancel" ? (
                                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                            ) : (
                                                                <XCircle className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}