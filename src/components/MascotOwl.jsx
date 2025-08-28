import React from 'react'

export default function MascotOwl(){
  return (
    <svg className="mascot" viewBox="0 0 160 160" width="180" height="180" aria-hidden="true">
      <defs>
        <style>{`
          .owl-body{ fill:#1d3b8a }
          .owl-belly{ fill:#ffcf6a }
          .owl-eye{ fill:#fff }
          .owl-pupil{ fill:#0f2353 }
          .owl-beak{ fill:#f6b73c }
          .owl-wing{ fill:#264fb6; transform-origin: 38px 98px; animation: flap 2.6s ease-in-out infinite }
          .blink{ transform-origin: 80px 74px; animation: blink 4.2s infinite }
          @keyframes flap{ 0%,100%{ transform:rotate(0deg) } 50%{ transform:rotate(-10deg) } }
          @keyframes blink{
            0%, 8%, 100% { transform:scaleY(1) }
            4% { transform:scaleY(0.05) }
          }
        `}</style>
      </defs>
      {/* gövde */}
      <circle className="owl-body" cx="80" cy="90" r="58" />
      <ellipse className="owl-belly" cx="80" cy="110" rx="42" ry="34"/>
      {/* kanat */}
      <ellipse className="owl-wing" cx="38" cy="98" rx="20" ry="30"/>
      <ellipse className="owl-wing" cx="122" cy="98" rx="20" ry="30" style={{animationDelay:'-1.3s', transformOrigin:'122px 98px'}}/>
      {/* gözler */}
      <circle className="owl-eye" cx="58" cy="74" r="16"/>
      <circle className="owl-eye" cx="102" cy="74" r="16"/>
      <circle className="owl-pupil" cx="58" cy="78" r="6"/>
      <circle className="owl-pupil" cx="102" cy="78" r="6"/>
      <rect className="blink" x="42" y="66" width="32" height="16" fill="#1d3b8a" opacity="0.2"/>
      <rect className="blink" x="86" y="66" width="32" height="16" fill="#1d3b8a" opacity="0.2" style={{animationDelay:'-1.6s'}}/>
      {/* gaga */}
      <polygon className="owl-beak" points="80,86 70,96 90,96"/>
      {/* baş çerçeve */}
      <circle cx="80" cy="76" r="34" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4"/>
    </svg>
  )
}
