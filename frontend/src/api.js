// Backend URL (Spring Boot).
// Local dev  -> http://localhost:8080 (default)
// Production -> set VITE_API_URL in .env.production before "npm run build"
export const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

// ---------- shared helpers used by every page ----------
export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const getName = () => localStorage.getItem("name");

export const money = (n) => "\u20B9" + Number(n).toFixed(2);

export function logout() {
  localStorage.clear();
  window.location.href = "/";
}

export async function api(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (getToken()) headers["Authorization"] = "Bearer " + getToken();

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
  }

  if (!res.ok) {
    // token expired
    if (res.status === 401 && getToken() && !path.startsWith("/api/auth")) logout();
    throw new Error((data && data.message) || "Request failed (" + res.status + ")");
  }
  return data;
}
