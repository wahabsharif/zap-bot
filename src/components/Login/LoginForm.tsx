"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios for making HTTP requests

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // This will be set based on API response
  const router = useRouter();

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return false;
    }
    // Additional validation logic can go here
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Make the API call to login
      const response = await axios.post("/api/users?action=login", {
        email,
        password,
      });

      const { token, isAdmin } = response.data;

      // Store the token if needed (e.g., in localStorage or state)
      // localStorage.setItem('token', token);

      setIsAdmin(isAdmin);

      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/bot");
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      if (axios.isAxiosError(err)) {
        // If the error is an Axios error, we can safely access err.response
        if (err.response) {
          errorMessage = err.response.data.message || "An error occurred";
        }
      } else if (err instanceof Error) {
        // For non-Axios errors, use the standard Error message
        errorMessage = err.message || "An error occurred";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-full max-w-md p-8 space-y-6 bg-black bg-opacity-30 backdrop-blur-md shadow-lg rounded-3xl">
        <h2 className="text-3xl font-bold text-center text-gray-200">
          Sign in to your account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-100 rounded">
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-gray-200"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-gray-200"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-center h-full">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 font-semibold text-gray-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
