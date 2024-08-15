"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersList from "../../../components/admin/Users/UsersList";
import AddUserForm from "../../../components/admin/Users/AddUserForm";

interface User {
  _id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  isOnline: boolean;
  lastLogin: Date;
  createdAt: Date;
}

export default function UserPage() {
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
    <>
      <AddUserForm onSuccess={fetchUsers} />
      <UsersList error={error} fetchUsers={fetchUsers} users={users} />
    </>
  );
}
