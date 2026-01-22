import { getWeekDates } from "../../utils/dateHelpers";
import { DayColumn } from "./DayColumn";
import { WeekNavigation } from "./WeekNavigation";
import { useApp } from "../../context/AppContext";
import { DndContext, closestCenter, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { toDateString } from "../../utils/dateHelpers";
import { useState } from "react";

export function CalendarView() {
  const { state, dispatch } = useApp();
  const allDates = getWeekDates(state.currentWeekStart);
  const currentDates = allDates.slice(0, 7);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const task = state.tasks.find((t) => t.id === taskId);

    if (!task) return;

    // over.id format is "{dateString}-tasks"
    const overDateString = (over.id as string).replace("-tasks", "");

    // If the task is moved to a different date, update it
    if (task.date !== overDateString) {
      dispatch({
        type: "UPDATE_TASK",
        payload: {
          id: taskId,
          updates: { date: overDateString },
        },
      });
    }
  };

  return (
    <div className="mb-8">
      <WeekNavigation />
      <DndContext 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div className="grid grid-cols-4 gap-2 scrollbar-hide overflow-x-auto w-full">
          {currentDates.map(({ date, isToday }) => (
            <DayColumn key={date.toISOString()} date={date} isToday={isToday} />
          ))}
        </div>
        <DragOverlay />
      </DndContext>
    </div>
  );
}
