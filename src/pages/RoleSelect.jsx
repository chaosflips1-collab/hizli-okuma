import React from 'react'
import MascotOwl from '../components/MascotOwl.jsx'

export default function RoleSelect({ goStudent, goTeacher }){
  return (
    <div className="welcomeCard">
      <div className="welcomeInner">
        <div className="mascotWrap" aria-hidden="true">
          <MascotOwl/>
        </div>

        <div>
          <h2 className="kidTitle">Merhaba! 👋</h2>
          <p className="kidSub">Rolünü seç ve maceraya başla. Hazırsan uçuyoruz! 🚀</p>

          <div className="kidBtns">
            <button className="kidBtn" onClick={goStudent}>
              <span className="kidIcon">🎒</span>
              <span>Öğrenci</span>
            </button>

            <button className="kidBtn" onClick={goTeacher}>
              <span className="kidIcon">🧑‍🏫</span>
              <span>Öğretmen</span>
            </button>
          </div>

          <div className="stickers" aria-hidden="true">
            <span>⭐</span><span>📚</span><span>🧠</span><span>🎯</span>
          </div>
        </div>
      </div>

      {/* Uçuşan minik şekiller (süs) */}
      <ul className="floaters" aria-hidden="true">
        <li></li><li></li><li></li><li></li><li></li>
      </ul>
    </div>
  )
}
