import { useApp } from "../../context/AppContext";
import { ListColumn } from "./ListColumn";
import { Plus } from "lucide-react";
import { useState } from "react";
import { COLOR_OPTIONS, ColorCode } from "../../utils/constants";

export function ListsSection() {
  const { state, dispatch } = useApp();
  const [showAddList, setShowAddList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ColorCode>("yellow");

  const handleAddList = () => {
    if (newListName.trim()) {
      dispatch({
        type: "ADD_LIST",
        payload: {
          name: newListName.trim(),
          colorCode: selectedColor,
          order: state.lists.length,
        },
      });
      setNewListName("");
      setSelectedColor("yellow");
      setShowAddList(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-purple-600"> 
          My Lists
          </h2>
        <button
          onClick={() => setShowAddList(!showAddList)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600    rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Plus size={14} />
          New List
        </button>
      </div>

      {showAddList && (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddList();
              if (e.key === "Escape") setShowAddList(false);
            }}
            placeholder="List name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 outline-none focus:border-gray-500 transition-colors"
            autoFocus
          />
          <div className="flex gap-2 mb-3">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.code}
                onClick={() => setSelectedColor(color.code)}
                className={`w-6 h-6 rounded-full transition-transform ${
                  selectedColor === color.code
                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                    : "hover:scale-105"
                }`}
                style={{
                  backgroundColor:
                    color.code === "yellow"
                      ? "#facc15"
                      : color.code === "blue"
                        ? "#60a5fa"
                        : color.code === "green"
                          ? "#4ade80"
                          : color.code === "pink"
                            ? "#f472b6"
                            : color.code === "purple"
                              ? "#c084fc"
                              : color.code === "orange"
                                ? "#fb923c"
                                : color.code === "red"
                                  ? "#f87171"
                                  : "#9ca3af",
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddList}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
            >
              Add List
            </button>
            <button
              onClick={() => setShowAddList(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {state.lists.map((list) => (
          <ListColumn key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
}
