import React, { useState, useEffect } from "react";
import { getUsersApi, getFilterOptionsApi } from "../actions/api";
import { User, FilterOptions, UserFilter } from "../types";
import UserList from "../components/userList";
import FilterSidebar from "../components/filterSidebar";
import SearchBar from "../components/searchBar";

const Page: React.FC = () => {
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

  useEffect(() => {
    // Reset users when filters change (except page)
    if (filters.page === 1) {
      setUsers([]);
    }

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          // Append new users when loading more pages
          setUsers((prevUsers) => [...prevUsers, ...response.data]);
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
      page: 1, // Reset to first page when search changes
    });
  };

  const handleFilterChange = (
    filterType: "nationality" | "hobby",
    value: string
  ) => {
    setFilters({
      ...filters,
      [filterType]: value,
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
    <div className="bg-black text-gray-900">
      {/* Sidebar */}
      <div className="lg:col-span-3">
        <div className="sticky top-6 space-y-6">
          {/* Search Card */}
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b px-4 py-3">
              <h2 className="font-medium text-gray-900">Search</h2>
            </div>
            <div className="p-4">
              <SearchBar
                value={filters.search || ""}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Filters Card */}
          <FilterSidebar
            filterOptions={filterOptions}
            selectedNationality={filters.nationality}
            selectedHobby={filters.hobby}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:col-span-9">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b px-4 py-3 flex items-center justify-between">
            <h2 className="font-medium text-gray-900">Users</h2>
            <div className="text-sm text-gray-500">
              {users.length > 0 && (
                <span>
                  Showing {users.length} of {filters.page * filters.limit} users
                </span>
              )}
            </div>
          </div>
          <div className="p-4">
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

export default Page;
