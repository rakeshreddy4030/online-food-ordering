import { useEffect, useRef, useState } from "react";
import { api, money } from "../api";
import { RatingLine } from "../components/Stars.jsx";

const STATUSES = ["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
const EMPTY_REST = { id: "", name: "", cuisine: "", address: "", description: "", imageUrl: "" };
const EMPTY_FOOD = { id: "", restaurantId: "", name: "", description: "", price: "", category: "", imageUrl: "" };

export default function Admin() {
  const [msg, setMsg] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restForm, setRestForm] = useState(EMPTY_REST);
  const [foodForm, setFoodForm] = useState(EMPTY_FOOD);
  const foodFormRef = useRef(null);

  // ---------- loaders ----------
  const loadRestaurants = async () => setRestaurants(await api("/api/restaurants"));
  const loadFoods = async () => setFoods(await api("/api/foods"));
  const loadOrders = async () => setOrders(await api("/api/orders/admin/all"));

  useEffect(() => {
    loadRestaurants().then(loadFoods).then(loadOrders).catch((e) => setMsg(e.message));
  }, []);

  // ---------- restaurants ----------
  function editRest(r) {
    setRestForm({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine || "",
      address: r.address || "",
      description: r.description || "",
      imageUrl: r.imageUrl || "",
    });
    window.scrollTo(0, 0);
  }

  async function saveRest(e) {
    e.preventDefault();
    const body = {
      name: restForm.name,
      cuisine: restForm.cuisine,
      address: restForm.address,
      description: restForm.description,
      imageUrl: restForm.imageUrl,
    };
    try {
      if (restForm.id) await api("/api/restaurants/" + restForm.id, "PUT", body);
      else await api("/api/restaurants", "POST", body);
      setMsg("");
      setRestForm(EMPTY_REST);
      await loadRestaurants();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function deleteRest(id) {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await api("/api/restaurants/" + id, "DELETE");
      setMsg("");
      await loadRestaurants();
      await loadFoods();
    } catch (err) {
      setMsg(err.message);
    }
  }

  // ---------- food items ----------
  function editFood(f) {
    setFoodForm({
      id: f.id,
      restaurantId: f.restaurant ? f.restaurant.id : "",
      name: f.name,
      description: f.description || "",
      price: f.price,
      category: f.category || "",
      imageUrl: f.imageUrl || "",
    });
    foodFormRef.current && foodFormRef.current.scrollIntoView();
  }

  async function saveFood(e) {
    e.preventDefault();
    const body = {
      restaurantId: Number(foodForm.restaurantId),
      name: foodForm.name,
      description: foodForm.description,
      price: Number(foodForm.price),
      category: foodForm.category,
      imageUrl: foodForm.imageUrl,
    };
    try {
      if (foodForm.id) await api("/api/foods/" + foodForm.id, "PUT", body);
      else await api("/api/foods", "POST", body);
      setMsg("");
      setFoodForm(EMPTY_FOOD);
      await loadFoods();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function deleteFood(id) {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api("/api/foods/" + id, "DELETE");
      setMsg("");
      await loadFoods();
    } catch (err) {
      setMsg(err.message);
    }
  }

  // ---------- orders ----------
  async function setStatus(id, status) {
    try {
      await api("/api/orders/admin/" + id + "/status", "PUT", { status });
      setMsg("");
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      setMsg(err.message);
      loadOrders();
    }
  }

  const rf = (key) => (e) => setRestForm({ ...restForm, [key]: e.target.value });
  const ff = (key) => (e) => setFoodForm({ ...foodForm, [key]: e.target.value });

  return (
    <div className="container">
      <p className="msg">{msg}</p>

      <h2>1. Manage Restaurants</h2>
      <div className="card">
        <form onSubmit={saveRest}>
          <label>Restaurant name</label>
          <input required value={restForm.name} onChange={rf("name")} />
          <label>Cuisine</label>
          <input placeholder="e.g. South Indian" value={restForm.cuisine} onChange={rf("cuisine")} />
          <label>Address / Area</label>
          <input value={restForm.address} onChange={rf("address")} />
          <label>Description</label>
          <input value={restForm.description} onChange={rf("description")} />
          <label>Image URL (optional)</label>
          <input value={restForm.imageUrl} onChange={rf("imageUrl")} />
          <button className="btn" type="submit">
            {restForm.id ? "Update Restaurant" : "Add Restaurant"}
          </button>{" "}
          <button className="btn gray" type="button" onClick={() => setRestForm(EMPTY_REST)}>Clear</button>
        </form>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Cuisine</th><th>Rating</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.cuisine}</td>
                <td><RatingLine r={r} /></td>
                <td>
                  <button className="btn small" onClick={() => editRest(r)}>Edit</button>{" "}
                  <button className="btn small red" onClick={() => deleteRest(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>2. Manage Food Items</h2>
      <div className="card" ref={foodFormRef}>
        <form onSubmit={saveFood}>
          <label>Restaurant</label>
          <select required value={foodForm.restaurantId} onChange={ff("restaurantId")}>
            <option value="">-- Select restaurant --</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <label>Food name</label>
          <input required value={foodForm.name} onChange={ff("name")} />
          <label>Description</label>
          <input value={foodForm.description} onChange={ff("description")} />
          <label>Price</label>
          <input type="number" step="0.01" min="1" required value={foodForm.price} onChange={ff("price")} />
          <label>Category</label>
          <input value={foodForm.category} onChange={ff("category")} />
          <label>Image URL (optional)</label>
          <input value={foodForm.imageUrl} onChange={ff("imageUrl")} />
          <button className="btn" type="submit">
            {foodForm.id ? "Update Food Item" : "Add Food Item"}
          </button>{" "}
          <button className="btn gray" type="button" onClick={() => setFoodForm(EMPTY_FOOD)}>Clear</button>
        </form>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Restaurant</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.restaurant ? f.restaurant.name : "-"}</td>
                <td>{f.name}</td>
                <td>{f.category}</td>
                <td>{money(f.price)}</td>
                <td>
                  <button className="btn small" onClick={() => editFood(f)}>Edit</button>{" "}
                  <button className="btn small red" onClick={() => deleteFood(f.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>3. All Orders</h2>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>#</th><th>Customer</th><th>Restaurant</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>
                  {o.user && o.user.name}
                  <br />
                  <small>{o.user && o.user.email}</small>
                </td>
                <td>{o.restaurant ? o.restaurant.name : "-"}</td>
                <td>
                  {o.items.map((i, idx) => (
                    <div key={idx}>{i.foodItem.name} x {i.quantity}</div>
                  ))}
                </td>
                <td>{money(o.totalAmount)}</td>
                <td>{new Date(o.orderDate).toLocaleString()}</td>
                <td>
                  <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
