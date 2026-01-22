import { List as ListType } from "../../utils/types";
import { TaskItem } from "../Task/TaskItem";
import { TaskInput } from "../Task/TaskInput";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useApp } from "../../context/AppContext";
import { useState } from "react";
import { MoreVertical, Trash2, Edit2 } from "lucide-react";

interface ListColumnProps {
  list: ListType;
}

const colorStyles = {
  yellow: "border-yellow-400",
  blue: "border-blue-400",
  green: "border-green-400",
  pink: "border-pink-400",
  purple: "border-purple-400",
  orange: "border-orange-400",
  red: "border-red-400",
  gray: "border-gray-400",
};

const textColorStyles = {
  yellow: "text-yellow-600",
  blue: "text-blue-600",
  green: "text-green-600",
  pink: "text-pink-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  red: "text-red-600",
  gray: "text-gray-600",
};

export function ListColumn({ list }: ListColumnProps) {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [showMenu, setShowMenu] = useState(false);

  const listTasks = state.tasks
    .filter((task) => task.listId === list.id)
    .sort((a, b) => a.order - b.order);

  const handleAddTask = (text: string) => {
    const maxOrder = listTasks.reduce(
      (max, task) => Math.max(max, task.order),
      -1,
    );
    dispatch({
      type: "ADD_TASK",
      payload: {
        text,
        completed: false,
        date: null,
        listId: list.id,
        colorCode: list.colorCode,
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

  const handleDeleteList = () => {
    dispatch({ type: "DELETE_LIST", payload: { id: list.id } });
    setShowMenu(false);
  };

  const handleRenameList = () => {
    if (listName.trim()) {
      dispatch({
        type: "UPDATE_LIST",
        payload: { id: list.id, updates: { name: listName.trim() } },
      });
      setIsEditing(false);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = listTasks.findIndex((task) => task.id === active.id);
      const newIndex = listTasks.findIndex((task) => task.id === over.id);
      const reorderedTasks = arrayMove(listTasks, oldIndex, newIndex).map(
        (task, index) => ({
          ...task,
          order: index,
        }),
      );
      dispatch({ type: "REORDER_TASKS", payload: { tasks: reorderedTasks } });
    }
  };

  return (
    <div className="w-full">
      <div
        className={`flex items-center justify-between mb-2 pb-2 border-b rounded-t-lg ${colorStyles[list.colorCode]}`}
      >
        {isEditing ? (
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onBlur={handleRenameList}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameList();
              if (e.key === "Escape") {
                setIsEditing(false);
                setListName(list.name);
              }
            }}
            className={`font-bold outline-none bg-transparent flex-1 text-sm ${textColorStyles[list.colorCode]}`}
            autoFocus
          />
        ) : (
          <div
            className={`font-bold cursor-pointer text-sm truncate ${textColorStyles[list.colorCode]}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {list.name}
          </div>
        )}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={14} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[120px]">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-t-lg"
              >
                <Edit2 size={12} />
                Rename
              </button>
              <button
                onClick={handleDeleteList}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 text-left hover:bg-red-50 rounded-b-lg"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 min-h-[200px] bg-white rounded-lg p-2 shadow-sm">
        {listTasks.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-6">
            <p className="mb-0.5 text-xs">No items yet</p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={listTasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {listTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => handleToggleTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onUpdate={(text) => handleUpdateTask(task.id, text)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        <TaskInput
          onAdd={handleAddTask}
          colorCode={list.colorCode}
          placeholder="+ Add item"
        />
      </div>
    </div>
  );
}
