import React, { useEffect, useMemo, useState } from 'react'
import { CLASS_OPTIONS } from '../utils/classes.js'
import { getTeacher, setTeacher } from '../utils/storage.js'

export default function TeacherLogin({ onLoggedIn }){
  const [name, setName] = useState('')
  const [cls, setCls] = useState('')
  const [lockedClass, setLockedClass] = useState(null)
  const [err, setErr] = useState('')
  const classOptions = useMemo(() => CLASS_OPTIONS, [])

  // Daha önce giriş yaptıysa sınıf kilitli gelir
  useEffect(() => {
    const t = getTeacher()
    if(t?.cls){
      setLockedClass(t.cls)
      setCls(t.cls)
      setName(t.name || '')
    }
  }, [])

  const submit = e => {
    e.preventDefault()
    setErr('')
    try{
      if(!name.trim()) throw new Error('Ad soyad gerekli.')
      const finalCls = lockedClass || cls
      if(!finalCls) throw new Error('Sınıf seçin.')
      const teacher = { name: name.trim(), cls: finalCls, since: new Date().toISOString() }
      setTeacher(teacher)
      onLoggedIn(teacher)
    }catch(e){
      setErr(e.message || 'Hata oluştu.')
    }
  }

  return (
    <div className="card">
      <div className="cardTitle">ÖĞRETMEN GİRİŞİ</div>
      <form onSubmit={submit} className="form">
        <label className="label">Ad Soyad
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Örn: Melek Hanım" />
        </label>
        <label className="label">Sınıf (kilitlenir)
          <select className="input" value={lockedClass || cls} onChange={e=>setCls(e.target.value)} disabled={!!lockedClass}>
            <option value="">{lockedClass ? `Kilitli sınıf: ${lockedClass}` : 'Sınıf seçin'}</option>
            {!lockedClass && classOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <div className="row">
          <span/>
          <button className="btn" type="submit">GİRİŞ</button>
        </div>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  )
}
