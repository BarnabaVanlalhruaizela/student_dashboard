import { useNavigate } from "react-router-dom";
import "../styles/listCard.css";

const TYPE_LABELS = {
  ASSIGNMENT: "Assignment",
  SESSION: "Live Session",
  QUIZ: "Quiz",
};

const TYPE_CLASSES = {
  ASSIGNMENT: "assignments",
  SESSION: "livesessions",
  QUIZ: "quiz",
};

const TYPE_ROUTES = {
  ASSIGNMENT: "/assignments",
  SESSION: "/live-sessions",
  QUIZ: "/subjects/quiz",
};

export default function NotificationCard({ title, subject, teacher, time, time2, day, type }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const route = TYPE_ROUTES[type];
    if (route) navigate(route);
  };

  const typeClass = TYPE_CLASSES[type] || "";
  const displayLabel = TYPE_LABELS[type] || type;

  return (
    <div
      className={`notifItem notifItem--${typeClass}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="notifItem__bar" />
      {day && <span className="notifItem__badge">{day}</span>}
      <div className="notifItem__content">
        <p className="notifItem__title">{title}</p>
        <p className="notifItem__sub">{subject}</p>
        <p className="notifItem__sub">{teacher}</p>
        <p className="notifItem__sub">{time}</p>
        {time2 && <p className="notifItem__time2">{time2}</p>}
      </div>
    </div>
  );
}
