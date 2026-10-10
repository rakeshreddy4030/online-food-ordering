import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Menu from "./pages/Menu.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import Orders from "./pages/Orders.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/menu" element={<ProtectedRoute role="CUSTOMER"><Menu /></ProtectedRoute>} />
      <Route path="/restaurant/:id" element={<ProtectedRoute role="CUSTOMER"><Restaurant /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute role="CUSTOMER"><Orders /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Admin /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
