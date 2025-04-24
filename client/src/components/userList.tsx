import React, { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { User } from "../types";
import Spinner from "./spinner";
import UserCard from "./userCard";
import Button from "./button";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  hasError: boolean;
  hasMoreData: boolean;
  onLoadMore: () => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  hasError,
  hasMoreData,
  onLoadMore,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingIndicatorRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 124,
    overscan: 5,
  });

  useEffect(() => {
    if (!hasMoreData || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingIndicatorRef.current) {
      observer.observe(loadingIndicatorRef.current);
    }

    return () => {
      if (loadingIndicatorRef.current) {
        observer.unobserve(loadingIndicatorRef.current);
      }
    };
  }, [hasMoreData, isLoading, onLoadMore]);

  if (hasError) {
    return (
      <div className="rounded-md bg-red-50 p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-base font-medium text-red-800">
          Error loading users
        </h3>
        <p className="mt-1 text-sm text-red-700">
          Failed to load users. Try again
        </p>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  if (!isLoading && users.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No users found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[calc(100vh-220px)] overflow-auto pr-2"
      >
        {/* Virtualized list container */}
        <div
          className="relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              className="absolute w-full left-0"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="py-2">
                <UserCard user={users[virtualRow.index]} />
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div ref={loadingIndicatorRef} className="py-4 text-center">
          {isLoading && (
            <div className="flex items-center justify-center">
              <Spinner size="sm" />
              <span className="ml-2 text-sm text-gray-500">
                Loading more users...
              </span>
            </div>
          )}

          {!isLoading && !hasMoreData && users.length > 0 && (
            <p className="text-sm text-gray-500">
              Yaay, you've reached end of list. Bueno.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
