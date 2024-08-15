"use client";

import React, { useState } from "react";

const BotController: React.FC = () => {
  const [status, setStatus] = useState<string>("Idle");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //   const [captcha, setCaptcha] = useState<string>("");

  const startBot = async () => {
    setStatus("Running");
    setErrorDetails(null);

    try {
      const response = await fetch("/api/puppeteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok) {
        setStatus("Success");
      } else {
        setStatus("Error");
        setErrorDetails(result.details || "Unknown error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setStatus("Error");
      setErrorDetails(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-5">
      <div className="p-6 max-w-md mx-auto bg-dark-glass rounded-xl shadow-lg backdrop-blur-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-4">
          Bot Control Panel
        </h1>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-900 focus:outline-none focus:border-blue-500"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-900 focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>
        {/* <div className="mb-6">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="captcha"
          >
            CAPTCHA
          </label>
          <input
            id="captcha"
            type="text"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-900 focus:outline-none focus:border-blue-500"
            placeholder="Enter CAPTCHA"
          />
        </div> */}
        <button
          onClick={startBot}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Start Bot
        </button>
        <p
          className={`mt-4 text-xl ${status === "Success" ? "text-green-400" : "text-red-400"}`}
        >
          Status: {status}
        </p>
        {errorDetails && (
          <p className="mt-2 text-red-300">Error Details: {errorDetails}</p>
        )}
      </div>
    </div>
  );
};

export default BotController;
