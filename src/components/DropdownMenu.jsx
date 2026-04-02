import { useEffect, useRef, useState } from "react";
import "../styles/dropdown.css";

const OPTIONS = [
  { value: "All", label: "All" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "SESSION", label: "Live Session" },
  { value: "QUIZ", label: "Quiz" },
];

export default function DropdownMenu({ value = "All", onChange }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel = OPTIONS.find((o) => o.value === value)?.label || value;

  return (
    <div className="dd" ref={boxRef}>
      <button className="dd__btn" onClick={() => setOpen(!open)}>
        <span className="dd__value">{activeLabel}</span>
        <span className={`dd__arrow ${open ? "dd__arrow--up" : ""}`}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {open && (
        <div className="dd__menu">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`dd__item ${value === opt.value ? "active" : ""}`}
              onClick={() => {
                onChange?.(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
