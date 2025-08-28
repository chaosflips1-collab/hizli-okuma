import React, { useMemo } from 'react'
import Header from '../components/Header.jsx'
import { getTeacher, listStudents } from '../utils/storage.js'

export default function TeacherPanel({ teacher, onLogout }){
  const my = useMemo(()=> teacher || getTeacher(), [teacher])
  const rows = useMemo(() => {
    const all = listStudents()
    return all.filter(s => s.cls === my.cls)
  }, [my])

  return (
    <>
      <Header
        title={`Hoş geldiniz, ${my.name} — Sınıfınız: ${my.cls}`}
        right={<button className="btn" onClick={onLogout}>Çıkış</button>}
      />
      <div className="panel" style={{padding:'0 10px'}}>
        <div className="unitCard">
          <h3>Öğrenciler (yalnızca {my.cls})</h3>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left', padding:8}}>Kod</th>
                  <th style={{textAlign:'left', padding:8}}>Ad Soyad</th>
                  <th style={{textAlign:'left', padding:8}}>Sınıf</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={3} style={{padding:8}}>Bu cihazda {my.cls} sınıfından giriş yapılmamış.</td></tr>
                )}
                {rows.map(r => (
                  <tr key={r.code}>
                    <td style={{padding:8}}>{r.code}</td>
                    <td style={{padding:8}}>{r.name}</td>
                    <td style={{padding:8}}>{r.cls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="kpi" style={{marginTop:8}}>
            Not: Bu demo yerel çalışır; liste, bu cihazda giriş yapan öğrencilerden oluşur.
          </p>
        </div>
      </div>
    </>
  )
}
