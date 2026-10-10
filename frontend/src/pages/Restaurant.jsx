import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, money } from "../api";
import { RatingLine } from "../components/Stars.jsx";

// ----- cart (one restaurant at a time), kept in localStorage -----
function loadCart() {
  try {
    const c = JSON.parse(localStorage.getItem("cart2"));
    if (c && c.items) return c;
  } catch (e) {}
  return { restaurantId: null, items: {} };
}

export default function Restaurant() {
  const rid = Number(useParams().id);
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [msg, setMsgState] = useState({ text: "", ok: false });
  const [cart, setCart] = useState(loadCart);

  const setMsg = (text, ok = false) => setMsgState({ text, ok });

  function updateCart(c) {
    setCart(c);
    localStorage.setItem("cart2", JSON.stringify(c));
  }

  const myItems = cart.restaurantId === rid ? cart.items : {};

  function addToCart(id) {
    let c = cart;
    if (c.restaurantId !== rid && Object.keys(c.items).length > 0) {
      if (!window.confirm("Your cart has items from another restaurant. Clear it and start a new cart here?")) return;
      c = { restaurantId: rid, items: {} };
    }
    updateCart({ restaurantId: rid, items: { ...c.items, [id]: (c.items[id] || 0) + 1 } });
  }

  function changeQty(id, d) {
    const items = { ...cart.items };
    items[id] = (items[id] || 0) + d;
    if (items[id] <= 0) delete items[id];
    updateCart({ ...cart, items });
  }

  async function rate(n) {
    try {
      const updated = await api("/api/restaurants/" + rid + "/rate", "POST", { stars: n });
      setRestaurant(updated);
      setMyRating(n);
      setMsg("Thanks for rating!", true);
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function placeOrder() {
    const items = cartIds.map((id) => ({ foodId: Number(id), quantity: myItems[id] }));
    try {
      await api("/api/orders", "POST", { items });
      updateCart({ restaurantId: null, items: {} });
      navigate("/orders");
    } catch (e) {
      setMsg(e.message);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async function () {
      try {
        const r = await api("/api/restaurants/" + rid);
        if (cancelled) return;
        setRestaurant(r);
        const f = await api("/api/restaurants/" + rid + "/foods");
        if (cancelled) return;
        setFoods(f);
        const mine = await api("/api/restaurants/" + rid + "/my-rating");
        if (!cancelled) setMyRating(mine.stars);
      } catch (e) {
        if (!cancelled) setMsg(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [rid]);

  const cartIds = Object.keys(myItems).filter((id) => foods.some((f) => f.id == id));
  let total = 0;
  cartIds.forEach((id) => {
    const f = foods.find((x) => x.id == id);
    total += f.price * myItems[id];
  });

  return (
    <div className="container">
      <Link to="/menu">&larr; All restaurants</Link>
      <p className={msg.ok ? "msg ok" : "msg"}>{msg.text}</p>

      <div className="card">
        {restaurant && (
          <>
            <h2>{restaurant.name}</h2>
            <span className="tag">{restaurant.cuisine}</span>
            <p>{restaurant.description}</p>
            <p style={{ color: "#777", fontSize: 13 }}>&#128205; {restaurant.address}</p>
            <div><RatingLine r={restaurant} /></div>
          </>
        )}
      </div>

      <div className="card">
        <b>Rate this restaurant:</b>{" "}
        <span>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={"star-pick" + (i <= myRating ? " on" : "")} onClick={() => rate(i)}>
              {"\u2605"}
            </span>
          ))}
        </span>{" "}
        <span style={{ color: "#777", fontSize: 13 }}>
          {myRating
            ? "You rated " + myRating + " star" + (myRating > 1 ? "s" : "") + " (click a star to change)"
            : "Click a star to rate"}
        </span>
      </div>

      <div className="layout">
        <div>
          <h2>Menu</h2>
          <div className="grid">
            {foods.length === 0 ? (
              <p>No food items yet.</p>
            ) : (
              foods.map((f) => (
                <div className="card" key={f.id}>
                  {f.imageUrl && <img src={f.imageUrl} alt="" />}
                  <h3>{f.name}</h3>
                  <span className="tag">{f.category}</span>
                  <p>{f.description}</p>
                  <div className="row">
                    <span className="price">{money(f.price)}</span>
                    <button className="btn small" onClick={() => addToCart(f.id)}>Add</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2>Your Cart</h2>
          <div className="card">
            {cartIds.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cartIds.map((id) => {
                  const f = foods.find((x) => x.id == id);
                  return (
                    <div className="row" key={id}>
                      <span>{f.name}</span>
                      <span>
                        <button className="btn small gray" onClick={() => changeQty(id, -1)}>-</button>{" "}
                        {myItems[id]}{" "}
                        <button className="btn small" onClick={() => changeQty(id, 1)}>+</button>
                      </span>
                      <span>{money(f.price * myItems[id])}</span>
                    </div>
                  );
                })}
                <hr />
                <div className="row">
                  <b>Total</b>
                  <b className="price">{money(total)}</b>
                </div>
                <button className="btn" style={{ width: "100%" }} onClick={placeOrder}>Place Order</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
