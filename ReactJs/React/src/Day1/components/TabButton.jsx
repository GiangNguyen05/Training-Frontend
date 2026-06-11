export default function TabButton({ children, onSelect }) {
  return (
    <button className="btn" onClick={onSelect}>
      {children}
    </button>
  );
}
