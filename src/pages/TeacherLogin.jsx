import React, { useMemo, useState } from 'react';
import { getSchools, getClasses, validateTeacherLogin } from '../utils/auth.js';

export default function TeacherLogin({ onLoggedIn }) {
  const schools = useMemo(() => getSchools(), []);
  const [schoolId, setSchoolId] = useState(schools[0]?.id ?? '');
  const classes = useMemo(() => getClasses(schoolId), [schoolId]);

  const [name, setName] = useState('');
  const [className, setClassName] = useState(classes[0] ?? '');
  const [err, setErr] = useState('');

  React.useEffect(() => {
    setClassName(getClasses(schoolId)[0] ?? '');
  }, [schoolId]);

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    try {
      const payload = validateTeacherLogin({ schoolId, name: name.trim(), className });
      if (typeof onLoggedIn === 'function') onLoggedIn(payload);
    } catch (ex) {
      setErr(ex.message || 'Giriş başarısız.');
    }
  };

  return (
    <form onSubmit={submit} className="loginBox">
      <h2>Öğretmen Girişi</h2>

      <label>Okul</label>
      <select value={schoolId} onChange={(e)=>setSchoolId(e.target.value)}>
        {schools.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <label>Sınıf (kilitlenir)</label>
      <select value={className} onChange={(e)=>setClassName(e.target.value)}>
        {classes.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <label>Ad Soyad</label>
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Örn: Melek Hanım" />

      {err && <div className="error">{err}</div>}
      <button type="submit">Giriş</button>
    </form>
  );
}
