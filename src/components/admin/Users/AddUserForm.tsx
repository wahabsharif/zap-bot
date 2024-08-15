// src/components/admin/Users/UserForm.tsx

"use client";

import { useState } from "react";
import axios from "axios";
import React from "react";

interface UserFormProps {
  onSuccess: () => void;
}

const AddUserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `/api/users?action=register`;
      const payload = { email, username, password, isAdmin };
      const response = await axios.post(url, payload);

      setMessage(response.data.message);

      setEmail("");
      setUsername("");
      setPassword("");
      setIsAdmin(false);

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-5 p-4 border border-gray-800 rounded-3xl shadow-lg bg-black/30 backdrop-blur-lg backdrop-filter">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-300">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 block w-full text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="text-lg font-medium text-gray-300 flex items-center">
            <span className="mr-2">Admin</span>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="hidden peer"
            />
            <div className="w-6 h-6 border-2 border-gray-300 rounded-lg flex items-center justify-center transition-all duration-300 peer-checked:bg-green-500 peer-checked:border-green-500 peer-checked:rotate-45">
              <svg
                className="w-4 h-4 text-transparent transition-all duration-300 transform peer-checked:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 block w-full text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 block w-full text-black border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Register"}
        </button>
        {error && <p className="mt-2 text-center text-red-500">{error}</p>}
        {message && (
          <p className="mt-2 text-center text-green-500">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AddUserForm;
