import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api("/api/orders/my").then(setOrders).catch((e) => setMsg(e.message));
  }, []);

  return (
    <div className="container">
      <h2>My Orders</h2>
      <p className="msg">{msg}</p>
      <div>
        {orders && orders.length === 0 && (
          <div className="card">No orders yet. Go to Restaurants and order something!</div>
        )}
        {orders && orders.map((o) => (
          <div className="card" key={o.id}>
            <div className="row">
              <b>Order #{o.id}</b>
              <span className="status">{o.status.replace(/_/g, " ")}</span>
            </div>
            {o.restaurant && (
              <div>
                <b>{o.restaurant.name}</b> &middot;{" "}
                <Link to={"/restaurant/" + o.restaurant.id}>Rate this restaurant</Link>
              </div>
            )}
            <div style={{ color: "#777", fontSize: 13 }}>{new Date(o.orderDate).toLocaleString()}</div>
            <ul>
              {o.items.map((i, idx) => (
                <li key={idx}>
                  {i.foodItem.name} x {i.quantity} &mdash; {money(i.price * i.quantity)}
                </li>
              ))}
            </ul>
            <b>Total: <span className="price">{money(o.totalAmount)}</span></b>
          </div>
        ))}
      </div>
    </div>
  );
}
