import React from 'react'

export default function ExercisePlaceholder({ name, onExit }){
  return (
    <div className="exerciseWrap">
      <h2>{name}</h2>
      <div style={{
        background:'#fff', padding:16, borderRadius:14,
        boxShadow:'inset 0 0 0 1px rgba(0,0,0,.06)'
      }}>
        <p style={{margin:0, fontSize:16}}>
          <strong>{name}</strong> egzersizi <em>yakında</em> burada çalışacak. Şimdilik sadece isimleri ekledik.
        </p>
      </div>
      <div className="exRow" style={{marginTop:12}}>
        <button className="btn" onClick={onExit}>Panele Dön</button>
      </div>
    </div>
  )
}
