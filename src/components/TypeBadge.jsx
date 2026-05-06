const TYPE_COLORS = {
  normal: "#b8b8a8",
  fire: "#ff8a4c",
  water: "#57a6ff",
  electric: "#f9cf32",
  grass: "#62c75b",
  ice: "#7fd4f8",
  fighting: "#e95f5c",
  poison: "#bb6bd9",
  ground: "#d5ae5f",
  flying: "#87a6ff",
  psychic: "#ff6ea8",
  bug: "#9ecb3b",
  rock: "#c3a35f",
  ghost: "#7a72d6",
  dragon: "#6a8df5",
  dark: "#7a5d4f",
  steel: "#8ba0b8",
  fairy: "#f5a7d8",
}

function TypeBadge({ type }) {
  if (!type) return null

  const lower = type.toLowerCase()

  return (
    <span
      className="type-badge"
      style={{ backgroundColor: TYPE_COLORS[lower] || "#94a3b8" }}
    >
      {type}
    </span>
  )
}

export default TypeBadge
