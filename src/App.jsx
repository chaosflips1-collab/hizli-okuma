import React, { useEffect, useState } from 'react'
import RoleSelect from './pages/RoleSelect.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import TeacherLogin from './pages/TeacherLogin.jsx'
import StudentPanel from './pages/StudentPanel.jsx'
import TeacherPanel from './pages/TeacherPanel.jsx'
import ExercisePlaceholder from './exercises/Placeholder.jsx'
import Takistoskop from './exercises/Takistoskop.jsx'
import Koseli from './exercises/Koseli.jsx'
import Acili from './exercises/Acili.jsx'            // <<— YENİ

import {
  getStudent, setStudent as saveStudent, clearStudent,
  getTeacher, setTeacher as saveTeacher, clearTeacher
} from './utils/storage.js'

export default function App(){
  // view: role | sLogin | tLogin | sPanel | tPanel | exercise | takistoskop | koseli | acili
  const [view, setView] = useState('role')
  const [student, setStudentState] = useState(null)
  const [teacher, setTeacherState] = useState(null)
  const [activeExercise, setActiveExercise] = useState(null) // {key,name}

  useEffect(() => {
    const s = getStudent()
    const t = getTeacher()
    if(s){ setStudentState(s); setView('sPanel') }
    else if(t){ setTeacherState(t); setView('tPanel') }
  }, [])

  // Öğrenci
  const onStudentLogged = (s) => { saveStudent(s); setStudentState(s); setView('sPanel') }
  const logoutStudent   = () => { clearStudent(); setStudentState(null); setView('role') }

  // Öğretmen
  const onTeacherLogged = (t) => { saveTeacher(t); setTeacherState(t); setView('tPanel') }
  const logoutTeacher   = () => { clearTeacher(); setTeacherState(null); setView('role') }

  // Egzersiz seçimi
  const openExercise = (item) => {
    setActiveExercise(item)
    switch (item?.key) {
      case 'takistoskop': setView('takistoskop'); break
      case 'koseli':      setView('koseli'); break
      case 'acili':       setView('acili'); break
      default:            setView('exercise')
    }
  }
  const closeExercise = () => { setView('sPanel'); setActiveExercise(null) }

  return (
    <div className="page">
      <div className="wrapper">
        <h1 className="hero">HIZLI OKUMA</h1>

        {view === 'role'   && <RoleSelect goStudent={()=>setView('sLogin')} goTeacher={()=>setView('tLogin')} />}
        {view === 'sLogin' && <StudentLogin onLoggedIn={onStudentLogged} />}
        {view === 'tLogin' && <TeacherLogin onLoggedIn={onTeacherLogged} />}

        {view === 'sPanel' && student && (
          <StudentPanel student={student} onOpenExercise={openExercise} onLogout={logoutStudent} />
        )}

        {view === 'tPanel' && teacher && (
          <TeacherPanel teacher={teacher} onLogout={logoutTeacher} />
        )}

        {view === 'exercise' && student && activeExercise && (
          <ExercisePlaceholder name={activeExercise.name} onExit={closeExercise} />
        )}

        {view === 'takistoskop' && student && (
          <Takistoskop student={student} onExit={closeExercise} onComplete={closeExercise} />
        )}

        {view === 'koseli' && student && (
          <Koseli student={student} onExit={closeExercise} onComplete={closeExercise} />
        )}

        {view === 'acili' && student && (
          <Acili student={student} onExit={closeExercise} onComplete={closeExercise} />
        )}

        <p className="footerNote">
          Öğrenci/Öğretmen login • Kod & sınıf kilitleme • Takistoskop, Köşeli ve Açılı aktif
        </p>
      </div>
    </div>
  )
}
