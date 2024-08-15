import React from "react";
import { MdSpaceDashboard, MdLogout } from "react-icons/md";
import { FaInbox, FaUsers } from "react-icons/fa6";
import Link from "next/link";
import LogoutButton from "../admin/Users/LogoutButton";

function SideBar() {
  return (
    <aside
      id="sidebar-multi-level-sidebar"
      className="fixed top-0 left-0 z-40 w-56 h-screen transition-transform -translate-x-full sm:translate-x-0 rounded-r-3xl"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-md flex flex-col">
        <ul className="space-y-2 font-medium flex-1">
          <li>
            <Link
              href="/admin"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <MdSpaceDashboard className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaInbox className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <FaUsers className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
            </Link>
          </li>
        </ul>
        <ul className="space-y-2 font-medium mt-auto">
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;
