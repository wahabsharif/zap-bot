"use client";

import React from "react";
import DeleteUserButton from "./DeleteUserButton";

interface User {
  _id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  isOnline: boolean;
  lastLogin: Date;
}

interface UsersListProps {
  users: User[];
  error: string;
  fetchUsers: () => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, error, fetchUsers }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 border border-gray-800 rounded-3xl shadow-lg bg-black/30 backdrop-blur-lg backdrop-filter">
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {user.isOnline ? "Online" : "Offline"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Never"}
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
