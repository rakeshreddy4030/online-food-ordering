import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, getToken, getRole } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [login, setLogin] = useState({ email: "", password: "" });
  const [reg, setReg] = useState({ name: "", email: "", password: "" });

  // already logged in -> go straight to the right page
  if (getToken()) return <Navigate to={getRole() === "ADMIN" ? "/admin" : "/menu"} replace />;

  function showTab(t) {
    setTab(t);
    setMsg({ text: "", ok: false });
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const d = await api("/api/auth/login", "POST", login);
      localStorage.setItem("token", d.token);
      localStorage.setItem("role", d.role);
      localStorage.setItem("name", d.name);
      navigate(d.role === "ADMIN" ? "/admin" : "/menu");
    } catch (err) {
      setMsg({ text: err.message, ok: false });
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const d = await api("/api/auth/register", "POST", reg);
      setTab("login");
      setMsg({ text: d.message, ok: true });
    } catch (err) {
      setMsg({ text: err.message, ok: false });
    }
  }

  return (
    <div className="container narrow">
      <h1 style={{ textAlign: "center" }}>&#127828; Food Ordering</h1>
      <div className="card">
        <div className="tabs">
          <button className={tab === "login" ? "active" : ""} onClick={() => showTab("login")}>Login</button>
          <button className={tab === "register" ? "active" : ""} onClick={() => showTab("register")}>Register</button>
        </div>
        <p className={msg.ok ? "msg ok" : "msg"}>{msg.text}</p>

        {tab === "login" ? (
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input type="email" required value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })} />
            <label>Password</label>
            <input type="password" required value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            <button className="btn" type="submit">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <label>Name</label>
            <input type="text" required value={reg.name}
              onChange={(e) => setReg({ ...reg, name: e.target.value })} />
            <label>Email</label>
            <input type="email" required value={reg.email}
              onChange={(e) => setReg({ ...reg, email: e.target.value })} />
            <label>Password (min 6 characters)</label>
            <input type="password" required minLength={6} value={reg.password}
              onChange={(e) => setReg({ ...reg, password: e.target.value })} />
            <button className="btn" type="submit">Create account</button>
          </form>
        )}
      </div>
      <p style={{ textAlign: "center", color: "#777", fontSize: 13 }}>
        Admin demo login: admin@food.com / admin123
      </p>
    </div>
  );
}
