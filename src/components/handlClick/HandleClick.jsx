'use client';
import { useState } from "react";

const PHONE = "996558000222";

const contacts = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    sublabel: `+${PHONE}`,
    href: `https://api.whatsapp.com/send/?phone=${PHONE}&text&type=phone_number&app_absent=0`,
    color: "#25D366",
    bg: "#25D36615",
    border: "#25D36635",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: "phone",
    label: "Позвонить",
    sublabel: `+${PHONE}`,
    href: `tel:+${PHONE}`,
    color: "#4FC3F7",
    bg: "#4FC3F715",
    border: "#4FC3F735",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    label: "Telegram",
    sublabel: `+${PHONE}`,
    href: `https://t.me/+${PHONE}`,
    color: "#29B6F6",
    bg: "#29B6F615",
    border: "#29B6F635",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

export default function FloatingButton() {
  const [open, setOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleFabClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((p) => [...p, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 700);
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    setOpen((v) => !v);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }

        html {
          font-size: 16px;
        }

        body {
          font-family: 'Sora', sans-serif;
              min-height: 100vh;
          min-height: 100dvh;
        }

        /* ── backdrop ── */
        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s ease;
        }
        .backdrop.show {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── FAB root ── */
        .fab-root {
          position: fixed;
          bottom: 24px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        /* ── desktop ── */
        @media (min-width: 480px) {
          .fab-root {
            bottom: 32px;
            right: 32px;
          }
        }

        /* ── contact list ── */
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }

        /* ── card ── */
        .contact-card {
          display: flex;
          align-items: center;
          gap: 11px;
          background: rgba(18, 22, 30, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 18px;
          padding: 11px 16px 11px 11px;
          text-decoration: none;
          cursor: pointer;
          opacity: 0;
          transform: translateX(20px) scale(0.9);
          pointer-events: none;
          transition: opacity 0.16s ease, transform 0.18s ease, background 0.18s;
          /* prevent text selection on mobile long-press */
          user-select: none;
          -webkit-user-select: none;
          /* full-width touch target on small screens */
          min-width: 0;
        }

        .contact-card.show {
          opacity: 1;
          transform: translateX(0) scale(1);
          pointer-events: auto;
        }

        /* staggered entrance */
        .contact-list .contact-card:nth-child(1).show {
          transition: opacity .22s .05s ease, transform .3s .05s cubic-bezier(.34,1.56,.64,1), background .18s;
        }
        .contact-list .contact-card:nth-child(2).show {
          transition: opacity .22s .11s ease, transform .3s .11s cubic-bezier(.34,1.56,.64,1), background .18s;
        }
        .contact-list .contact-card:nth-child(3).show {
          transition: opacity .22s .17s ease, transform .3s .17s cubic-bezier(.34,1.56,.64,1), background .18s;
        }

        /* hover (desktop) */
        @media (hover: hover) {
          .contact-card:hover {
            background: rgba(255, 255, 255, 0.07);
            transform: translateY(-2px) scale(1.02);
          }
        }

        /* active (mobile touch) */
        .contact-card:active {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(0.97);
        }

        /* ── icon box ── */
        .contact-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* smaller on very small phones */
        @media (max-width: 360px) {
          .contact-icon {
            width: 38px;
            height: 38px;
            border-radius: 12px;
          }
        }

        /* ── text ── */
        .contact-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .contact-name {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
          line-height: 1;
          white-space: nowrap;
        }

        .contact-sub {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        @media (max-width: 360px) {
          .contact-name { font-size: 12px; }
          .contact-sub  { font-size: 10px; }
        }

        /* ── FAB button ── */
        .fab-btn {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 18px;
          border: none;
          cursor: pointer;
          outline: none;
          overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(140deg, #25D366 0%, #128C7E 100%);
          box-shadow:
            0 6px 24px rgba(37, 211, 102, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), box-shadow 0.15s ease;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }

        @media (min-width: 480px) {
          .fab-btn {
            width: 62px;
            height: 62px;
            border-radius: 20px;
          }
        }

        @media (hover: hover) {
          .fab-btn:hover {
            transform: scale(1.07) translateY(-2px);
            box-shadow:
              0 14px 40px rgba(37, 211, 102, 0.6),
              0 0 0 1px rgba(255, 255, 255, 0.15) inset;
          }
        }

        .fab-btn.pressed {
          transform: scale(0.91) !important;
          box-shadow: 0 3px 12px rgba(37, 211, 102, 0.3) !important;
        }

        .fab-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: transform 0.32s cubic-bezier(.34,1.56,.64,1);
        }
        .fab-inner.spin { transform: rotate(135deg); }

        /* ripple */
        .ripple {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: translate(-50%, -50%) scale(0);
          animation: rip 0.6s ease-out forwards;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes rip {
          to { transform: translate(-50%, -50%) scale(18); opacity: 0; }
        }

        /* pulse ring */
        .pulse {
          position: absolute;
          inset: -5px;
          border-radius: 23px;
          border: 2px solid rgba(37, 211, 102, 0.5);
          animation: pulse-anim 2.4s ease-out infinite;
          pointer-events: none;
        }
        .pulse.off {
          animation: none;
          opacity: 0;
          transition: opacity 0.2s;
        }
        @keyframes pulse-anim {
          0%  { transform: scale(1);    opacity: 0.5; }
          70% { transform: scale(1.7);  opacity: 0;   }
          100%{ transform: scale(1.7);  opacity: 0;   }
        }

        /* ── label tooltip on FAB (closed state) ── */
        .fab-tooltip {
          position: absolute;
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: rgba(18, 22, 30, 0.9);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: rgba(255,255,255,0.75);
          font-size: 12px;
          font-family: 'Sora', sans-serif;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .fab-btn:hover .fab-tooltip {
          opacity: 1;
        }
      `}</style>

      {/* backdrop */}
      <div
        className={`backdrop ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <div className="fab-root">
        {/* contact cards */}
        <div className="contact-list">
          {contacts.map((c) => (
            <a
              key={c.id}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`contact-card ${open ? "show" : ""}`}
              style={{
                boxShadow: open ? `0 4px 20px ${c.color}18` : "none",
              }}
            >
              <div
                className="contact-icon"
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.color,
                }}
              >
                {c.icon}
              </div>
              <div className="contact-text">
                <span className="contact-name">{c.label}</span>
                <span className="contact-sub">{c.sublabel}</span>
              </div>
            </a>
          ))}
        </div>

        {/* main FAB */}
        <button
          className={`fab-btn ${pressed ? "pressed" : ""}`}
          onClick={handleFabClick}
          aria-label="Связаться с нами"
        >
          <div className={`pulse ${open ? "off" : ""}`} />

          {ripples.map((r) => (
            <span
              key={r.id}
              className="ripple"
              style={{ left: r.x, top: r.y }}
            />
          ))}

          <span className="fab-tooltip">Связаться</span>

          <div className={`fab-inner ${open ? "spin" : ""}`}>
            {open ? (
              <svg width="21" height="21" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            ) : (
              <svg width="25" height="25" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </>
  );
}