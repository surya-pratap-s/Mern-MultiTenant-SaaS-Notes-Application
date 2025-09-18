import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

// ✅ Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const HomePage = lazy(() => import("./pages/HomePage"));
const InvitePages = lazy(() => import("./pages/InvitePages"));
const MembersPage = lazy(() => import("./pages/MembersPage"));
const NoteEditor = lazy(() => import("./pages/NoteEditor"));

export default function App() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingSpinner />; // ✅ user fetch hone tak
  }

  return (
    <Router>
      <ToastContainer position="top-right" />

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={!user ? <LandingPage /> : <HomePage />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={'/'} />} />
          <Route path="/signup" element={!user ? <Register /> : <Navigate to={'/'} />} />

          <Route path="/invite" element={!user ? <Navigate to={'/'} /> : user?.role === "admin" ? <InvitePages /> : <Navigate to={'/'} />} />
          <Route path="/members" element={!user ? <Navigate to={'/'} /> : user?.role === "admin" ? <MembersPage /> : <Navigate to={'/'} />} />

          <Route path="/note-create" element={!user ? <Navigate to="/" /> : <NoteEditor />} />
          <Route path="/note-create/:id" element={!user ? <Navigate to="/" /> : <NoteEditor />} />

          <Route path="*" element={
            <div className="flex justify-center items-center h-screen text-lg">
              Page Not Found
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}
