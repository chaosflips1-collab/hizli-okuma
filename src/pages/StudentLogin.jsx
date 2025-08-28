import React, { useEffect, useMemo, useState } from 'react'
import { CLASS_OPTIONS } from '../utils/classes.js'
import { getLockedInfo, lockCodeToStudent, setStudent, addStudentToList } from '../utils/storage.js'

export default function StudentLogin({ onLoggedIn }){
  const [form, setForm] = useState({ code:'', name:'', cls:'', remember:true })
  const [lockedClass, setLockedClass] = useState(null)
  const [err, setErr] = useState('')

  // Kod yazıldıkça kilit bilgisini getir
  useEffect(() => {
    const info = form.code ? getLockedInfo(form.code) : null
    setLockedClass(info?.cls || null)
    if(info?.cls){ setForm(f => ({ ...f, cls: info.cls })) }
  }, [form.code])

  const classOptions = useMemo(() => CLASS_OPTIONS, [])

  const handle = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type==='checkbox' ? checked : value }))
  }

  const submit = e => {
    e.preventDefault()
    setErr('')

    try{
      if(!form.code.trim() || !form.name.trim()) throw new Error('Kod ve ad soyad gerekli.')
      const cls = lockedClass || form.cls
      if(!cls) throw new Error('Sınıf seçin.')
      // Kod kilitle (ilk kezse kilitler; kilitliyse doğrular)
      const info = lockCodeToStudent({ code: form.code, name: form.name, cls })
      const student = { code: info ? form.code.trim().toUpperCase() : form.code, name: form.name.trim(), cls }
      if(form.remember) setStudent(student)
      addStudentToList(student)
      onLoggedIn(student)
    }catch(e){
      setErr(e.message || 'Hata oluştu.')
    }
  }

  return (
    <div className="card">
      <div className="cardTitle">ÖĞRENCİ GİRİŞİ</div>
      <form onSubmit={submit} className="form">
        <label className="label">Öğrenci Kodu
          <input className="input" name="code" value={form.code} onChange={handle} placeholder="Örn: ABC123" />
        </label>
        <label className="label">Ad Soyad
          <input className="input" name="name" value={form.name} onChange={handle} placeholder="Örn: Ayşe Yılmaz" />
        </label>
        <label className="label">Sınıf
          <select
            className="input"
            name="cls"
            value={lockedClass || form.cls}
            onChange={handle}
            disabled={!!lockedClass}
          >
            <option value="">{lockedClass ? `Kilitli sınıf: ${lockedClass}` : 'Sınıf seçin'}</option>
            {!lockedClass && classOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <div className="row">
          <label style={{color:'#fff'}}>
            <input type="checkbox" name="remember" checked={form.remember} onChange={handle}/> Beni hatırla
          </label>
          <button className="btn" type="submit">GİRİŞ</button>
        </div>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  )
}
