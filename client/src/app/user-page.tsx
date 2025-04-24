import React, { useState, useEffect } from "react";
import { getUsersApi, getFilterOptionsApi } from "../actions/api";
import { User, FilterOptions, UserFilter } from "../types";
import SearchBar from "../components/searchBar";
import UserList from "../components/userList";
import FilterSidebar from "../components/filterSidebar";

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    nationalities: [],
    hobbies: [],
  });
  const [filters, setFilters] = useState<UserFilter>({
    page: 1,
    limit: 20,
    search: "",
    nationality: "",
    hobby: "",
    sort: "firstName",
    order: "ASC",
  });
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [nationality, setNationality] = useState("");
  const [hobby, setHobby] = useState("");

  useEffect(() => {
    if (filters.page === 1) {
      setUsers([]);
    }
    fetchUsers();
  }, [filters]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const response = await getUsersApi(filters);

      if (response.success) {
        if (filters.page === 1) {
          setUsers(response.data);
        } else {
          setUsers((prev) => [...prev, ...response.data]);
        }

        setTotalPages(response.metadata.totalPages);
        setHasMoreData(filters.page < response.metadata.totalPages);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await getFilterOptionsApi();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters({
      ...filters,
      search: searchTerm,
      page: 1,
    });
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      search: "",
      nationality: "",
      hobby: "",
      sort: "firstName",
      order: "ASC",
    });
    setNationality("");
    setHobby("");
  };

  const handleFilterChange = (type: "nationality" | "hobby", value: string) => {
    console.log(`Setting ${type} to:`, value);

    if (type === "nationality") {
      setNationality(value);
    } else if (type === "hobby") {
      setHobby(value);
    }

    // Add this to update the actual filters used for fetching
    setFilters({
      ...filters,
      [type]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMoreData) {
      setFilters({
        ...filters,
        page: filters.page + 1,
      });
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
      <div className="lg:col-span-1">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">Search</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <SearchBar
                value={filters?.search || ""}
                onChange={handleSearchChange}
                placeholder="Find users by name"
              />
            </div>
          </div>

          <FilterSidebar
            filterOptions={filterOptions}
            selectedNationality={nationality}
            selectedHobby={hobby}
            onFilterChange={handleFilterChange}
            onClearFilters={resetFilters}
          />
        </div>
      </div>

      <div className="mt-6 lg:mt-0 lg:col-span-3">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-900">
              Users ({totalPages} Pages)
            </h3>
            {users.length > 0 && (
              <span className="text-sm text-gray-500">
                Showing {users.length} of {filters.page * filters.limit} users
              </span>
            )}
          </div>
          <div className="px-4 py-5 sm:p-6">
            <UserList
              users={users}
              isLoading={isLoading}
              hasError={hasError}
              hasMoreData={hasMoreData}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
