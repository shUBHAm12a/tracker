import { Menu, Search } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <Menu size={20} />
        </button>
        <div className="text-xl font-bold text-gray-800">TeuxDeux</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <Search size={20} />
        </button>
      </div>
    </header>
  );
}
