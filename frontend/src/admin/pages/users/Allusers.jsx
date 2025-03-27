import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch users");

        setUsers(data.users);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleVerificationToggle = async (userId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;

      // Optimistically update UI
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, verified: updatedStatus } : user
        )
      );

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${userId}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ verified: updatedStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update verification status");
      }
    } catch (error) {
      setError(error.message);

      // Revert UI if request fails
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, verified: currentStatus } : user
        )
      );
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      (user.city && user.city.toLowerCase().includes(searchTerm))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key] || ""; // Handle undefined values
      const bValue = b[sortConfig.key] || "";
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        User Management
      </h2>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            onChange={handleSearch}
          />
          <svg
            className="absolute right-2 sm:right-3 top-2 sm:top-3 h-4 sm:h-5 w-4 sm:w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-64">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="40"
            sm:width="50"
            visible={true}
          />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      ) : sortedUsers.length === 0 ? (
        <div className="p-4 bg-blue-100 text-blue-700 rounded-lg text-sm sm:text-base">
          No users found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortConfig.key === "name" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th
                  className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 cursor-pointer"
                  onClick={() => handleSort("city")}
                >
                  City{" "}
                  {sortConfig.key === "city" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 cursor-pointer"
                  onClick={() => handleSort("verified")}
                >
                  Status{" "}
                  {sortConfig.key === "verified" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 text-sm sm:text-base">
                    {user.name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 text-sm sm:text-base">
                    {user.email}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 text-sm sm:text-base">
                    {user.city || "N/A"}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        user.verified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.verified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <button
                      onClick={() =>
                        handleVerificationToggle(user._id, user.verified)
                      }
                      className={`relative inline-flex h-5 sm:h-6 w-10 sm:w-11 items-center rounded-full transition-colors focus:outline-none ${
                        user.verified ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 sm:h-4 w-3 sm:w-4 transform rounded-full bg-white transition-transform ${
                          user.verified ? "translate-x-5 sm:translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;