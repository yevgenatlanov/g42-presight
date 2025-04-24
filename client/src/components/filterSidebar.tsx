import React from "react";
import { FilterOptions } from "../types";
import FilterList from "./filterList";

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  selectedNationality?: string;
  selectedHobby?: string;
  onFilterChange: (filterType: "nationality" | "hobby", value: string) => void;
  onClearFilters?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterOptions,
  selectedNationality,
  selectedHobby,
  onFilterChange,
  onClearFilters,
}) => {
  const resetFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    } else {
      onFilterChange("nationality", "");
      onFilterChange("hobby", "");
    }
  };

  const hasActiveFilters = Boolean(selectedNationality || selectedHobby);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-base font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-medium text-red-500 hover:text-red-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Nationality
          </h4>
          <FilterList
            items={filterOptions.nationalities}
            selectedValue={selectedNationality}
            onChange={(value) => onFilterChange("nationality", value)}
          />
        </div>

        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Hobbies
          </h4>
          <FilterList
            items={filterOptions.hobbies}
            selectedValue={selectedHobby}
            onChange={(value) => onFilterChange("hobby", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
