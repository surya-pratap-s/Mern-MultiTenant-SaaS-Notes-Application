import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [loading, setLoading] = useState(false);

    // Interceptor for 401
    API.interceptors.response.use(
        (res) => res,
        (err) => {
            if (err.response?.status === 401) logout();
            return Promise.reject(err);
        }
    );

    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser().finally(() => setAuthLoading(false));
        } else {
            setAuthLoading(false);
        }
    }, [token]);


    const fetchUser = async () => {
        if (!token) return;
        try {
            const res = await API.get("/auth/me");
            const user = res.data.user;
            setUser(user);
        } catch (err) {
            toast.error("Failed to fetch user:", err.response?.data?.message || err.message);
            logout();
        }
    };

    // Login
    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            const { user, token } = res.data;
            setUser(user);
            setToken(token);
            localStorage.setItem("token", token);
            toast.success("Logged in successfully");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
    };

    // Notes CRUD
    const getNotes = async ({ search = "", sortBy = "updatedAt", order = "desc" } = {}) => {
        try {
            const res = await API.get("/notes", {
                params: { search, sortBy, order }
            });
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch notes");
            return { success: false, data: [] };
        }
    };


    const getNoteById = async (id) => {
        try {
            const res = await API.get(`/notes/${id}`);
            return res.data.note; // Single note
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch note");
        }
    };

    const createNote = async (note) => {
        try {
            const res = await API.post("/notes", note);
            toast.success("Note created!");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create note");
        }
    };

    const updateNote = async (id, note) => {
        try {
            const res = await API.put(`/notes/${id}`, note);
            toast.success("Note updated!");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update note");
        }
    };

    const deleteNote = async (id) => {
        try {
            await API.delete(`/notes/${id}`);
            toast.success("Note deleted!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete note");
        }
    };

    // Tenants ----
    const getAllTenants = async () => {
        try {
            const res = await API.get("/tenants");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch tenants");
            return [];
        }
    };

    const upgradeTenant = async () => {
        try {
            const res = await API.post(`/tenants/${user.tenantId.slug}/upgrade`);
            toast.success("Tenant upgraded to Pro!");
            fetchUser();
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Upgrade failed");
        }
    };

    // invitation
    const [invitations, setInvitations] = useState([]);

    const fetchInvitations = async () => {
        const { data } = await API.get("/invitations");
        setInvitations(data);
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleInvite = async (payload) => {
        try {
            await API.post("/invitations/invite", payload);
            fetchInvitations();
            toast.success("Invitation Send Successfull")
        } catch (error) {
            toast.error(error.response?.data?.message || "Invitation Send Failed")
        }

    };

    const handleResend = async (id) => {
        try {
            await API.post(`/invitations/${id}/resend`);
            fetchInvitations();
            toast.success("Resend Invitation Successfull")
        } catch (error) {
            toast.error(error.response?.data?.message || "Resend Invitation Failed")
        }
    };

    const handleCancel = async (id) => {
        try {
            await API.delete(`/invitations/${id}`);
            fetchInvitations();
            toast.success("Successfull Deleted")
        } catch (error) {
            toast.error(error.response?.data?.message || "Delete Invitation Failed")
        }

    };

    return (
        <AuthContext.Provider value={{
            user, token, loading, login, logout, authLoading,
            getNotes, createNote, updateNote, deleteNote, getNoteById,
            getAllTenants, upgradeTenant,
            invitations, handleInvite, handleResend, handleCancel,
        }}>

            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
