import React from 'react'

export default function UnitCard({ badge, title, locked=false, kpi, children }){
  return (
    <div className={"unitCard " + (locked ? "locked" : "")}>
      <span className="badge">{badge}</span>
      <h3>{title}</h3>
      {kpi && <p className="kpi">{kpi}</p>}
      <div className="row" style={{justifyContent:'flex-start', gap:8}}>
        {children}
      </div>
    </div>
  )
}
