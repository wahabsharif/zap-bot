"use client";

import React, { useState } from "react";
import DeleteUserButton from "./DeleteUserButton";

interface User {
  _id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  isOnline: boolean;
  lastLogin: Date;
  createdAt: Date;
}

interface UsersListProps {
  users: User[];
  error: string;
  fetchUsers: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, error, fetchUsers }) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Sort users by isAdmin and createdAt date
  const sortedUsers = [...users].sort((a, b) => {
    // First sort by isAdmin
    if (a.isAdmin !== b.isAdmin) {
      return a.isAdmin ? -1 : 1;
    }

    // Then sort by createdAt date
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Toggle sort order between ascending and descending
  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Format date and time
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long", // Full month name
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full p-4 border border-gray-800 rounded-3xl shadow-lg bg-black/30 backdrop-blur-lg backdrop-filter">
      <h2 className="text-2xl font-bold mb-4 text-center">Users List</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Admin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Last Login
            </th>
            <th
              onClick={handleSort}
              className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider cursor-pointer"
            >
              Created At {sortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {user.isAdmin ? "Yes" : "No"}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${user.isOnline ? "text-green-500" : "text-red-500"}`}
              >
                {user.isOnline ? "Online" : "Offline"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {user.lastLogin
                  ? `${formatDate(user.lastLogin)} ${formatTime(user.lastLogin)}`
                  : "Never"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {formatDate(user.createdAt)} {formatTime(user.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <DeleteUserButton userId={user._id} onSuccess={fetchUsers} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
