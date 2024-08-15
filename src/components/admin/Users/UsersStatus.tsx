"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  username: string;
  email: string;
  isOnline: boolean;
}

const UsersStatus: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users?action=getAllUsers");
        const sortedUsers = response.data.sort((a: User, b: User) => {
          // Sort users by online status: online first, then offline
          return b.isOnline === a.isOnline ? 0 : b.isOnline ? 1 : -1;
        });
        setUsers(sortedUsers);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[500px] p-4 border border-gray-800 rounded-3xl shadow-lg bg-black/30 backdrop-blur-lg backdrop-filter">
      <h2 className="text-xl font-bold text-center mb-4">Users Status</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left">Username</th>
            <th className="border-b px-4 py-2 text-left">Email</th>
            <th className="border-b px-4 py-2 text-left">Online Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="border-b px-4 py-2">{user.username}</td>
              <td className="border-b px-4 py-2">{user.email}</td>
              <td className="border-b px-4 py-2">
                {user.isOnline ? (
                  <p className="text-green-500">
                    Online{" "}
                    <span className="h-3 w-3 bg-green-500 rounded-full inline-block"></span>
                  </p>
                ) : (
                  <p className="text-red-500">
                    Offline{" "}
                    <span className="h-3 w-3 bg-red-500 rounded-full inline-block"></span>
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersStatus;
