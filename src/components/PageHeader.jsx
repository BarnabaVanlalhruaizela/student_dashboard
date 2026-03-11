import "../styles/pageHeader.css";

export default function PageHeader({ title, onSearch }) {
  return (
    <div className="pageHeader">
      <h2 className="pageHeaderTitle">{title}</h2>

      <div className="pageHeaderSearch">
        <input placeholder="Search..."
         onChange={(e) => onSearch(e.target.value)} 
        />
        <span className="pageHeaderSearchIcon">🔍</span>
      </div>
    </div>
  );
}
