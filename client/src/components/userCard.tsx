import React from "react";
import { User } from "../types";
import Badge from "./badge";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const visibleHobbies = user.hobbies.slice(0, 3);
  const remainingCount = Math.max(0, user.hobbies.length - 3);

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow">
      <div className="p-4 flex space-x-4">
        <div className="flex-shrink-0">
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-14 w-14 rounded-full object-cover border border-gray-200"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {user.age} years
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">{user.nationality}</p>

          {user.hobbies && user.hobbies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {visibleHobbies.map((hobby, index) => (
                <Badge key={index} variant="secondary">
                  {hobby}
                </Badge>
              ))}

              {remainingCount > 0 && (
                <Badge
                  variant="outline"
                  title={user.hobbies.slice(3).join(", ")}
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
