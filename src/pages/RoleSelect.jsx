import { useNavigate } from 'react-router-dom';

export default function RoleSelect({ goStudent, goTeacher }) {
  const nav = useNavigate();

  // Buton click: App'ten fonksiyon geldiyse onu çağır; gelmediyse route'a git
  const handleStudentClick = () => {
    if (typeof goStudent === 'function') return goStudent();
    nav('/student-login');
  };

  const handleTeacherClick = () => {
    if (typeof goTeacher === 'function') return goTeacher();
    nav('/teacher-login');
  };

  return (
    <main className="role">
      <div className="roleBG" aria-hidden="true" />

      <section className="roleCard" aria-labelledby="appTitle">
        <div className="roleAvatar" aria-hidden="true">
          <svg viewBox="0 0 120 120" width="160" height="160" role="img" aria-label="Penguen">
            <defs>
              <clipPath id="mask">
                <circle cx="60" cy="60" r="56" />
              </clipPath>
            </defs>
            <circle cx="60" cy="60" r="56" fill="#163d8f" />
            <g clipPath="url(#mask)">
              <circle cx="60" cy="62" r="38" fill="#ffe28a" />
              <circle cx="48" cy="55" r="10" fill="#fff" />
              <circle cx="72" cy="55" r="10" fill="#fff" />
              <circle cx="48" cy="55" r="6" />
              <circle cx="72" cy="55" r="6" />
              <path d="M60 62 l-16 8 16 8 16-8z" fill="#f4b000" />
            </g>
          </svg>
        </div>

        <h1 id="appTitle">Merhaba! <span aria-hidden="true">👋</span></h1>
        <p className="unitDesc">Rolünü seç ve maceraya başla. Hazırsan uçuyoruz!</p>

        <div className="roleActions">
          <button className="roleBtn" onClick={handleStudentClick}>
            <span className="icon" aria-hidden="true">🎒</span> Öğrenci
          </button>

          <button className="roleBtn" onClick={handleTeacherClick}>
            <span className="icon" aria-hidden="true">📚</span> Öğretmen
          </button>
        </div>

        <div className="roleBadges" aria-hidden="true">
          <span className="chip">★</span>
          <span className="chip">🔷</span>
          <span className="chip">🎯</span>
        </div>
      </section>
    </main>
  );
}
