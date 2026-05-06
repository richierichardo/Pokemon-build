function StatBar({ label, value, max = 180 }) {
  const width = Math.min(100, Math.round((Number(value || 0) / max) * 100))

  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${width}%` }} />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  )
}

export default StatBar
