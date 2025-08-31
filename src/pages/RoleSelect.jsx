import React from 'react';

export default function RoleSelect({ goStudent, goTeacher }) {
  return (
    <main className="role">
      {/* dekoratif arka plan */}
      <div className="roleBG" aria-hidden="true" />

      <section className="roleCard" aria-labelledby="role-title">
        {/* maskot */}
        <div className="roleAvatar" aria-hidden="true">
          <svg viewBox="0 0 120 120" width="160" height="160">
            <defs>
              <clipPath id="mask">
                <circle cx="60" cy="60" r="56" />
              </clipPath>
            </defs>
            <circle cx="60" cy="60" r="56" fill="#102a5c" />
            <g clipPath="url(#mask)">
              <circle cx="60" cy="64" r="44" fill="#2a4f9e" />
              <circle cx="60" cy="70" r="26" fill="#f6d36e" />
              <circle cx="48" cy="60" r="7" fill="#fff" />
              <circle cx="72" cy="60" r="7" fill="#fff" />
              <circle cx="48" cy="60" r="3" fill="#171717" />
              <circle cx="72" cy="60" r="3" fill="#171717" />
              <path d="M60 70 l-16 10 h32 z" fill="#e88f2a" />
            </g>
          </svg>
        </div>

        <h2 id="role-title" className="appTitle" style={{ marginTop: 8 }}>
          Merhaba! <span aria-hidden="true">👋</span>
        </h2>
        <p className="roleSub">
          Rolünü seç ve maceraya başla. Hazırsan uçuyoruz!
        </p>

        <div className="actionRow">
          <button className="roleBtn" onClick={goStudent}>
            <span className="icon" aria-hidden="true">
              {/* book svg */}
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M4 5a2 2 0 012-2h12v16H6a2 2 0 01-2-2V5z"
                  fill="currentColor"
                />
              </svg>
            </span>
            Öğrenci
          </button>

          <button className="roleBtn" onClick={goTeacher}>
            <span className="icon" aria-hidden="true">
              {/* teacher/board svg */}
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M3 5h18v10H3zM5 17h6l5 2v-2h3"
                  fill="currentColor"
                />
              </svg>
            </span>
            Öğretmen
          </button>
        </div>

        <div className="roleBadges" aria-hidden="true">
          <span className="chip">{/* star */}<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="currentColor"/></svg></span>
          <span className="chip">{/* chat */}<svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 4h16v12H7l-3 3z" fill="currentColor"/></svg></span>
          <span className="chip">{/* target */}<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="10" fill="currentColor" opacity=".2"/><circle cx="12" cy="12" r="6" fill="currentColor" opacity=".35"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg></span>
        </div>
      </section>
    </main>
  );
}
