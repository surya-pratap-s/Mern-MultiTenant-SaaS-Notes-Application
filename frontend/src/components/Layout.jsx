import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, Menu, X, Calendar, Users, Crown, ArrowUpCircle, Gift, Book, UserPlus, Mail, LogOut, Infinity, NotebookPen, } from 'lucide-react';

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, upgradeTenant } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="h-screen w-full fixed">
            {/* Layout Switcher */}
            <div className="mx-auto flex items-center justify-between py-3 px-2 bg-white/5 backdrop-blur-xl border border-white/10">
                <div className='flex gap-2'>
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-white hover:text-gray-200">
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>

                    <h3 className="flex items-center gap-2 text-white py-2">
                        <Book className="w-5 h-5 hidden sm:flex text-blue-300" />
                        <span className="font-medium text-xl">{user?.tenantId?.name}</span>
                    </h3>
                </div>

                <div className='flex gap-2 px-2'>
                    {user?.tenantId?.subscription?.plan === "free" &&
                        <div className="relative flex items-center gap-2 px-3 py-2 border rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                            <Gift className="w-4 h-4 sm:w-5 sm:h-5 p-0 m-0 text-green-500" />
                            <span className="p-0 m-0">Free</span>
                            <span className="text-white bg-red-500 text-xs px-2 py-1 rounded-full absolute -top-2 -right-2">3</span>
                        </div>
                    }

                    {user?.tenantId?.subscription?.plan === "pro" &&
                        <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                            <Crown className="w-4 h-4 sm:w-5 sm:h-5 p-0 m-0 text-green-500" />
                            <span className="p-0 m-0">Pro</span>
                            <Infinity className='text-xs w-5 h-5' />
                        </div>
                    }

                    {user?.role === "admin" && user?.tenantId?.subscription?.plan === "free" &&
                        <button onClick={() => { upgradeTenant(); navigate("/") }} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 sm:px-4 py-2 rounded sm:rounded-xl shadow-md hover:scale-105 transition">
                            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                            <span className="font-medium text-xs sm:text-xl">Pro</span>
                            <ArrowUpCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </button>
                    }
                </div>
            </div>

            <div className='flex'>
                <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-30 w-64 bg-white/5 backdrop-blur-xl border border-white/10 h-screen fixed transition-transform duration-300 ease-in-out`}>
                    <nav className="space-y-2 py-2 px-2">
                        {[
                            { icon: Calendar, label: 'Dashboard', path: "/" },
                            { icon: NotebookPen, label: 'Note Create', path: "/note-create" },
                            { icon: UserPlus, label: 'Invite', path: "/invite", admin: true },
                            { icon: Users, label: 'Members', path: "/members", admin: true },
                            { icon: Settings, label: 'Settings', path: "/settings" }
                        ]
                            .filter((item) => !item.admin || user?.role === "admin")
                            .map((item, idx) => (
                                <div onClick={() => navigate(item.path)} key={idx} className={`flex items-center space-x-3 p-3 cursor-pointer ${item.path === location.pathname ? "bg-white/5" : "text-white hover:bg-white/5"}`}>
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            ))}

                        <div className={`flex items-center space-x-3 p-3 cursor-pointer bg-white/5 rounded`}>
                            <Mail className="h-5 w-5" />
                            <span className="text-xs">{user?.name}</span>
                            <span className="text-xs rounded-full shadow-lg border py-1 px-2 bg-green-500 border-gray-500 capitalize">{user?.role}</span>
                        </div>
                        <div onClick={() => logout()} className={`flex items-center space-x-3 p-3 cursor-pointer bg-white/5 rounded`}>
                            <LogOut className="h-5 w-5" />
                            <span className="text-xs">Logout</span>
                        </div>
                    </nav>

                </div>

                {children}
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (<div className="fixed inset-0 bg-black/7 bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />)}
        </div>
    )
}
