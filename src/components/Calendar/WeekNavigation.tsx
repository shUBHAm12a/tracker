import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { addDays, getWeekStart } from "../../utils/dateHelpers";
import { parseISO } from "date-fns";

export function WeekNavigation() {
  const { state, dispatch } = useApp();

  const handlePreviousWeek = () => {
    const currentDate = parseISO(state.currentWeekStart);
    const newStart = addDays(currentDate, -6);
    dispatch({
      type: "SET_WEEK_START",
      payload: { date: newStart.toISOString() },
    });
  };

  const handleNextWeek = () => {
    const currentDate = parseISO(state.currentWeekStart);
    const newStart = addDays(currentDate, 6);
    dispatch({
      type: "SET_WEEK_START",
      payload: { date: newStart.toISOString() },
    });
  };

  const handleToday = () => {
    const today = new Date();
    const weekStart = getWeekStart(today);
    dispatch({
      type: "SET_WEEK_START",
      payload: { date: weekStart.toISOString() },
    });
  };

  return (
    <div className="flex items-center justify-center mb-4 gap-2">
      <button
        onClick={handlePreviousWeek}
        className="p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={16} color="#982efc" />
      </button>
      <button
        onClick={handleToday}
        className="px-4 py-2 text-sm font-semibold rounded-md bg-purple-500 border border-purple-700 hover:bg-purple-700 transition-colors text-white"
      >
        Today
      </button>
      <button
        onClick={handleNextWeek}
        className="p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight size={16} color="#982efc" />
      </button>
    </div>
  );
}
