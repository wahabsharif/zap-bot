// components/UserManagement.tsx

"use client";

import { useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";
import UsersList from "./UsersList";
import React from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  _id?: string;
  username?: string;
  isAdmin?: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users?action=getAllUsers");
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data.message || "An error occurred");
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      <UserForm onSuccess={fetchUsers} />
      <UsersList User={users} error={error} />
    </div>
  );
};

export default UserManagement;
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}
