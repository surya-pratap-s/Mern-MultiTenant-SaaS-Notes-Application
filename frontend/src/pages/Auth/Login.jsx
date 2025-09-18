import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Notebook } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const { login, loading } = useAuth()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) navigate("/");
    };


    return (
        <div className="relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <div className="relative flex h-screen flex-col overflow-auto">
                <div className="flex justify-between bg-white/5 backdrop-blur-xl border border-white/10 px-2 md:px-4 py-2 md:py-4 mb-2">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl">
                        <Notebook className="text-blue-500" />
                        <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Notesly
                        </span>
                    </Link>
                </div>

                {/* Main content */}
                <div className="sm:mx-auto sm:w-full sm:max-w-md px-2">

                    {/* Login Card */}
                    <div className="relative bg-white/5 backdrop-blur-xl rounded border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <LogIn className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-semibold text-white">Login Admin & Tenant</h2>
                        </div>

                        <div className="relative p-4 md:p-8">
                            <div className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email address</label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200"
                                            placeholder="Enter your email"
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 peer-focus:opacity-20 pointer-events-none"></div>
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                                        <Link className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pr-12 text-white placeholder:text-gray-500 focus:border-purple-400 focus:bg-white/10 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-200"
                                            placeholder="Enter your password"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                            {showPassword ? (
                                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember me checkbox */}
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-400 focus:ring-offset-0" />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300">
                                        Remember me
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center justify-center">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign in'
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}