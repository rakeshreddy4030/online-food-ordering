import { Link } from "react-router-dom";
import { getRole, getName, logout } from "../api";

export default function Navbar() {
  const isAdmin = getRole() === "ADMIN";
  return (
    <div className="navbar">
      <span className="brand">{"\uD83C\uDF54"} Food Ordering</span>
      <div>
        <span>Hi, {getName()}</span>
        {isAdmin ? (
          <Link to="/admin">Admin Dashboard</Link>
        ) : (
          <>
            <Link to="/menu">Restaurants</Link>
            <Link to="/orders">My Orders</Link>
          </>
        )}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
