import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Task, List } from "../utils/types";
import { storage } from "../utils/storage";
import { STORAGE_KEYS, DEFAULT_LISTS } from "../utils/constants";
import { v4 as uuidv4 } from "uuid";
import { getWeekStart } from "../utils/dateHelpers";

interface AppState {
  tasks: Task[];
  lists: List[];
  currentWeekStart: string;
}

type AppAction =
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "createdAt"> }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "TOGGLE_TASK"; payload: { id: string } }
  | { type: "REORDER_TASKS"; payload: { tasks: Task[] } }
  | { type: "ADD_LIST"; payload: Omit<List, "id"> }
  | { type: "UPDATE_LIST"; payload: { id: string; updates: Partial<List> } }
  | { type: "DELETE_LIST"; payload: { id: string } }
  | { type: "SET_WEEK_START"; payload: { date: string } }
  | { type: "LOAD_DATA"; payload: AppState };

const initialState: AppState = {
  tasks: storage.get("TASKS", []),
  lists: storage.get(
    "LISTS",
    DEFAULT_LISTS.map((list) => ({
      ...list,
      id: uuidv4(),
      order: 0,
    })),
  ),
  currentWeekStart: storage.get(
    "CURRENT_WEEK",
    getWeekStart(new Date()).toISOString(),
  ),
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_TASK": {
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      const tasks = [...state.tasks, newTask];
      return { ...state, tasks };
    }

    case "UPDATE_TASK": {
      const tasks = state.tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates }
          : task,
      );
      return { ...state, tasks };
    }

    case "DELETE_TASK": {
      const tasks = state.tasks.filter((task) => task.id !== action.payload.id);
      return { ...state, tasks };
    }

    case "TOGGLE_TASK": {
      const tasks = state.tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task,
      );
      return { ...state, tasks };
    }

    case "REORDER_TASKS": {
      return { ...state, tasks: action.payload.tasks };
    }

    case "ADD_LIST": {
      const newList: List = {
        ...action.payload,
        id: uuidv4(),
      };
      const lists = [...state.lists, newList];
      return { ...state, lists };
    }

    case "UPDATE_LIST": {
      const lists = state.lists.map((list) =>
        list.id === action.payload.id
          ? { ...list, ...action.payload.updates }
          : list,
      );
      return { ...state, lists };
    }

    case "DELETE_LIST": {
      const lists = state.lists.filter((list) => list.id !== action.payload.id);
      const tasks = state.tasks.filter(
        (task) => task.listId !== action.payload.id,
      );
      return { ...state, lists, tasks };
    }

    case "SET_WEEK_START": {
      return { ...state, currentWeekStart: action.payload.date };
    }

    case "LOAD_DATA": {
      return action.payload;
    }

    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    storage.set("TASKS", state.tasks);
    storage.set("LISTS", state.lists);
    storage.set("CURRENT_WEEK", state.currentWeekStart);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
