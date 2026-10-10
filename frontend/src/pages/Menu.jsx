import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { RatingLine } from "../components/Stars.jsx";

export default function Menu() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api("/api/restaurants").then(setAll).catch((e) => setMsg(e.message));
  }, []);

  const q = search.toLowerCase();
  const rows = all.filter((r) => (r.name + " " + (r.cuisine || "")).toLowerCase().includes(q));

  return (
    <div className="container">
      <h2>Restaurants</h2>
      <input placeholder="Search by restaurant name or cuisine..." value={search}
        onChange={(e) => setSearch(e.target.value)} />
      <p className="msg">{msg}</p>
      <div className="grid">
        {rows.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          rows.map((r) => (
            <div className="card" key={r.id}>
              {r.imageUrl && <img src={r.imageUrl} alt="" />}
              <h3>{r.name}</h3>
              <span className="tag">{r.cuisine}</span>
              <p>{r.description}</p>
              <p style={{ color: "#777", fontSize: 13 }}>&#128205; {r.address}</p>
              <div><RatingLine r={r} /></div>
              <Link className="btn-link" to={"/restaurant/" + r.id}>View Menu</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
