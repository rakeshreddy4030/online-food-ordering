export function Stars({ avg }) {
  const full = Math.round(avg);
  return <span className="stars">{"\u2605".repeat(full) + "\u2606".repeat(5 - full)}</span>;
}

export function RatingLine({ r }) {
  if (!(r.ratingCount > 0)) return <span style={{ color: "#777" }}>No ratings yet</span>;
  return (
    <>
      <Stars avg={r.avgRating} /> <b>{Number(r.avgRating).toFixed(1)}</b>{" "}
      <span style={{ color: "#777" }}>
        ({r.ratingCount} rating{r.ratingCount > 1 ? "s" : ""})
      </span>
    </>
  );
}
