import React from "react";
import { FilterCountItem } from "../types";

interface FilterListProps {
  items: FilterCountItem[];
  selectedValue?: string;
  onChange: (value: string) => void;
}

const FilterList: React.FC<FilterListProps> = ({
  items,
  selectedValue,
  onChange,
}) => {
  // Debug the current selected value
  console.log("Selected value:", selectedValue);

  const handleItemClick = (value: string) => {
    if (selectedValue === value) {
      // Explicitly log what's happening
      console.log("Unselecting:", value);
      onChange("");
    } else {
      console.log("Selecting:", value);
      onChange(value);
    }
  };

  if (items.length === 0) {
    return <div className="text-sm text-gray-500">No options available</div>;
  }

  return (
    <div className="max-h-60 overflow-y-auto pr-1 space-y-1">
      {items.map((item) => {
        // Check if this item is selected
        const isSelected = selectedValue === item.value;

        return (
          <button
            key={item.value}
            onClick={() => handleItemClick(item.value)}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors ${
              isSelected
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            // Add a data attribute for debugging
            data-selected={isSelected}
          >
            <span className="truncate">{item.value}</span>
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                isSelected
                  ? "bg-white bg-opacity-20 text-black"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterList;
