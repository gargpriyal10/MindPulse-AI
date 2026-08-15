import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Monitoring from "../pages/Monitoring/Monitoring";
import History from "../pages/History/History";
import Reports from "../pages/Reports/Reports";
import Profile from "../pages/Profile/Profile";

function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#080E14",
        color: "#F8FAFC",
        fontFamily: "inherit",
      }}
    >
      <h1>{title}</h1>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/monitoring" element={<Monitoring />} />

      <Route path="/history" element={<History />} />

      <Route path="/reports" element={<Reports />} />

      <Route path="/profile" element={<Profile />} />

      <Route
        path="/settings"
        element={<PlaceholderPage title="Settings" />}
      />

      <Route
        path="*"
        element={<PlaceholderPage title="404 — Page Not Found" />}
      />
    </Routes>
  );
}

export default AppRoutes;