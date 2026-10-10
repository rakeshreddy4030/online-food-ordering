import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../api";
import Navbar from "./Navbar.jsx";

// Wrap a page: <ProtectedRoute role="ADMIN"><Admin /></ProtectedRoute>
export default function ProtectedRoute({ role, children }) {
  if (!getToken()) return <Navigate to="/" replace />;
  if (role && getRole() !== role) {
    return <Navigate to={getRole() === "ADMIN" ? "/admin" : "/menu"} replace />;
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
