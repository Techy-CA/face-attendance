import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", background: "#1e1b4b", display: "flex", gap: "2rem" }}>
        <Link to="/register" style={{ color: "white" }}>Register</Link>
        <Link to="/attendance" style={{ color: "white" }}>Mark Attendance</Link>
        <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
