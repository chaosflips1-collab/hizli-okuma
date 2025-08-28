import React from 'react'

export default function Header({ title, left=null, right=null }){
  return (
    <div className="panelTop">
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        {left}
        <strong>{title}</strong>
      </div>
      <div style={{display:'flex', gap:8}}>{right}</div>
    </div>
  )
}
