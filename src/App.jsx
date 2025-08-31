import React, { useEffect, useState } from 'react';

import RoleSelect from './pages/RoleSelect.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import TeacherLogin from './pages/TeacherLogin.jsx';
import StudentPanel from './pages/StudentPanel.jsx';
import TeacherPanel from './pages/TeacherPanel.jsx';
import ExercisePlaceholder from './exercises/Placeholder.jsx'; // varsa

import {
  getStudent,
  setStudent as saveStudent,
  clearStudent,
  getTeacher,
  setTeacher as saveTeacher,
  clearTeacher,
} from './utils/storage.js';

import './App.css';

export default function App() {
  // hangi ekran?
  const [view, setView] = useState('role');

  // oturum sahipleri
  const [student, setStudentState] = useState(null);
  const [teacher, setTeacherState] = useState(null);

  // egzersiz (öğrenci)
  const [activeExercise, setActiveExercise] = useState(null);

  // “beni hatırla” ile kayıtlı kullanıcı varsa panele al
  useEffect(() => {
    const s = getStudent();
    const t = getTeacher();
    if (s) {
      setStudentState(s);
      setView('sPanel');
    } else if (t) {
      setTeacherState(t);
      setView('tPanel');
    }
  }, []);

  // RoleSelect’ten geçişler
  const goStudent = () => setView('sLogin');
  const goTeacher = () => setView('tLogin');

  // login / logout
  const onStudentLogged = (s) => {
    saveStudent(s);
    setStudentState(s);
    setView('sPanel');
  };
  const onTeacherLogged = (t) => {
    saveTeacher(t);
    setTeacherState(t);
    setView('tPanel');
  };
  const logoutStudent = () => {
    clearStudent();
    setStudentState(null);
    setView('role');
  };
  const logoutTeacher = () => {
    clearTeacher();
    setTeacherState(null);
    setView('role');
  };

  // egzersiz
  const openExercise = (item) => {
    setActiveExercise(item);
    setView('exercise');
  };
  const closeExercise = () => {
    setActiveExercise(null);
    setView('sPanel');
  };

  return (
    <div className="page">
      <div className="wrapper">
        <h1 className="hero">HIZLI OKUMA</h1>

        {view === 'role' && (
          <RoleSelect goStudent={goStudent} goTeacher={goTeacher} />
        )}

        {view === 'sLogin' && <StudentLogin onLoggedIn={onStudentLogged} />}
        {view === 'tLogin' && <TeacherLogin onLoggedIn={onTeacherLogged} />}

        {view === 'sPanel' && student && (
          <StudentPanel
            student={student}
            onOpenExercise={openExercise}
            onLogout={logoutStudent}
          />
        )}

        {view === 'tPanel' && teacher && (
          <TeacherPanel teacher={teacher} onLogout={logoutTeacher} />
        )}

        {view === 'exercise' && student && activeExercise && (
          <ExercisePlaceholder
            name={activeExercise?.name}
            onExit={closeExercise}
          />
        )}
      </div>
    </div>
  );
}
