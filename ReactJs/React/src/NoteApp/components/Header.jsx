import { StickyNote } from "lucide-react";

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <StickyNote size={22} />
        <span>Notes</span>
      </div>
    </header>
  );
}
