// src/components/admin/Users/LogoutButton.tsx

"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { MdLogout } from "react-icons/md";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found in localStorage");
        // Handle the case where userId is not found, e.g., redirect to login page
        router.push("/"); // Redirect to login or an error page
        return;
      }

      const response = await fetch("/api/users?action=logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // Send userId in request body
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("userId");
      localStorage.removeItem("token");

      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700"
    >
      <MdLogout className="w-5 h-5 text-white mr-2" />
      <span className="whitespace-nowrap">Logout</span>
    </button>
  );
};

export default LogoutButton;
