import { CalendarView } from "./components/Calendar/CalendarView";
import { ListsSection } from "./components/Lists/ListsSection";
import { Container } from "./components/Layout/Container";
import "@theme-toggles/react/css/Expand.css";
import { Expand } from "@theme-toggles/react";
import { useState } from "react";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}
    >
      <Container>
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-500">
            STALK UR TRACK 🧢
          </h1>
          <button
            className="p-[24px] scale-150 cursor-pointer transition-colors"
            style={{ color: "#a855f7", background: "none", border: "none" }}
          >
            <Expand toggled={isDarkMode} toggle={handleThemeToggle} />
          </button>
        </header>
        <CalendarView />
        <ListsSection />
      </Container>
    </div>
  );
}
