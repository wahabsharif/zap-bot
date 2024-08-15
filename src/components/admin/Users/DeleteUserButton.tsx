// components/DeleteUserButton.tsx

import axios from "axios";
import React from "react";

interface DeleteUserButtonProps {
  userId: string;
  onSuccess: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({
  userId,
  onSuccess,
}) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/${userId}`);
      onSuccess();
    } catch (err: any) {
      console.error(err.response?.data.message || "An error occurred");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      Delete
    </button>
  );
};

export default DeleteUserButton;
