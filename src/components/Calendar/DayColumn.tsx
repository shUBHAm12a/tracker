import { format } from "date-fns";
import { TaskItem } from "../Task/TaskItem";
import { TaskInput } from "../Task/TaskInput";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useApp } from "../../context/AppContext";
import { toDateString } from "../../utils/dateHelpers";
import { useDroppable } from "@dnd-kit/core";

interface DayColumnProps {
  date: Date;
  isToday: boolean;
}

export function DayColumn({ date, isToday }: DayColumnProps) {
  const { state, dispatch } = useApp();
  const dateString = toDateString(date);
  const { setNodeRef } = useDroppable({
    id: `${dateString}-tasks`,
  });

  const dayTasks = state.tasks
    .filter((task) => task.date === dateString)
    .sort((a, b) => a.order - b.order);

  const handleAddTask = (text: string) => {
    const maxOrder = dayTasks.reduce(
      (max, task) => Math.max(max, task.order),
      -1,
    );
    dispatch({
      type: "ADD_TASK",
      payload: {
        text,
        completed: false,
        date: dateString,
        listId: null,
        colorCode: "gray",
        order: maxOrder + 1,
      },
    });
  };

  const handleToggleTask = (taskId: string) => {
    dispatch({ type: "TOGGLE_TASK", payload: { id: taskId } });
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch({ type: "DELETE_TASK", payload: { id: taskId } });
  };

  const handleUpdateTask = (taskId: string, text: string) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: { id: taskId, updates: { text } },
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = dayTasks.findIndex((task) => task.id === active.id);
      const newIndex = dayTasks.findIndex((task) => task.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedTasks = arrayMove(dayTasks, oldIndex, newIndex).map(
          (task, index) => ({
            ...task,
            order: index,
          }),
        );
        dispatch({ type: "REORDER_TASKS", payload: { tasks: reorderedTasks } });
      }
    }
  };

  return (
    <div className="w-full min-w-[calc(25%-8px)] flex-shrink-0">
      <div
        className={`text-center mb-3 sm:mb-4 pb-2 sm:pb-3 rounded-lg ${
          isToday
            ? "bg-purple-50 border-b-2 border-purple-400"
            : "bg-white border-b-2 border-gray-200"
        } shadow-sm`}
      >
        <div
          className={`text-[10px] sm:text-xs uppercase font-semibold tracking-wide ${
            isToday ? "text-purple-600" : "text-gray-500"
          }`}
        >
          {format(date, "EEE")}
        </div>
        <div
          className={`text-xl sm:text-2xl font-bold ${
            isToday ? "text-purple-700" : "text-gray-800"
          }`}
        >
          {format(date, "d")}
        </div>
      </div>

      <div
        className="space-y-2 sm:space-y-3 min-h-[300px] sm:min-h-[400px] bg-white rounded-lg p-2 sm:p-3 shadow-sm transition-all duration-200"
        ref={setNodeRef}
      >
        {dayTasks.length === 0 ? (
          <div className="text-center text-gray-400 text-xs sm:text-sm py-8 sm:py-12">
            <p className="mb-1 text-xs sm:text-sm">No tasks yet</p>
            <p className="text-[10px] sm:text-xs">Add your first task below</p>
          </div>
        ) : (
          <SortableContext
            items={dayTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {dayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => handleToggleTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
                onUpdate={(text) => handleUpdateTask(task.id, text)}
              />
            ))}
          </SortableContext>
        )}

        <TaskInput
          onAdd={handleAddTask}
          colorCode="gray"
          placeholder="+ Add task"
        />
      </div>
    </div>
  );
}
