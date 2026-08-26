import { Navigate, Route, Routes } from "react-router-dom";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Monitoring from "../pages/Monitoring/Monitoring";
import History from "../pages/History/History";
import Reports from "../pages/Reports/Reports";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";

/* ============================================================
   AUTH HELPERS
============================================================ */

function isAuthenticated() {
  try {
    const auth =
      localStorage.getItem("mindpulse_auth");

    if (!auth) {
      return false;
    }

    const parsedAuth =
      JSON.parse(auth);

    return parsedAuth?.authenticated === true;
  } catch (error) {
    console.error(
      "Unable to read authentication state:",
      error
    );

    return false;
  }
}

/* ============================================================
   PROTECTED ROUTE
============================================================ */

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

/* ============================================================
   AUTH ROUTE
============================================================ */

function AuthRoute({ children }) {
  if (isAuthenticated()) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

/* ============================================================
   404
============================================================ */

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

/* ============================================================
   ROUTES
============================================================ */

function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />

      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />

      {/* =====================================================
          PROTECTED ROUTES
      ===================================================== */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/monitoring"
        element={
          <ProtectedRoute>
            <Monitoring />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={
          <PlaceholderPage
            title="404 — Page Not Found"
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;