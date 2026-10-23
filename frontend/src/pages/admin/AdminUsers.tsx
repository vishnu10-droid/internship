"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In demo mode, use localStorage
      const storedUsers: any[] = JSON.parse(
        localStorage.getItem("admin-users") || "[]"
      );
      setUsers(storedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      filterRole === "all" ||
      (u.role && u.role === filterRole)
  );

  const searchUsers = filteredUsers.filter(
    (u) =>
      (u.full_name && u.full_name.toLowerCase().includes(search.toLower())) ||
      (u.email && u.email.toLowerCase().includes(search.toLower()))
  );

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, active: !u.active } : u
      )
    );
    // Update localStorage
    localStorage.setItem(
      "admin-users",
      JSON.stringify(setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active: !u.active } : u)))
    );
  }, []);

  const removeUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    localStorage.setItem("admin-users", JSON.stringify(setUsers));
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading users...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        User Management
      </h1>

      {/* Search and filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="select"
          >
            <option value="all">All roles</option>
            <option value="patient">Patients</option>
            <option value="physiotherapist">Physiotherapists</option>
            <option value="admin">Administrators</option>
          </select>
          <button className="btn-primary py-2 rounded-lg text-sm">Apply</button>
        </div>
      </div>

      {/* Users table */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Users ({filteredUsers.length})</h2>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <i className="search" size={48} className="mb-4" />
            <p>No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchUsers.map((user: any) => (
                  <tr key={user.id} className="border-b border-secondary/5">
                    <td className="p-3 font-medium">
                      {user.full_name || "Unknown"}
                    </td>
                    <td className="p-3 text-muted truncate">
                      {user.email}
                    </td>
                    <td className="p-3">
                      <span
                        className={user.role === "admin"
                          ? "bg-red-100 text-red-800 px-2 py-1 rounded text-xs"
                          : user.role === "physiotherapist"
                          ? "bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                          : "bg-secondary/10 text-main px-2 py-1 rounded text-xs"}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={user.active
                          ? "bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                          : "bg-red-100 text-red-800 px-2 py-1 rounded text-xs"}
                      >
                        {user.active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className="text-primary hover:text-primary/90 text-sm"
                        >
                          {user.active ? "Suspend" : "Reactivate"}
                        </button>
                        <button
                          className="text-danger hover:text-danger/90 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {searchUsers.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted" colspan="5">
                      No users matching criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* No results message when loading */}
        {isLoading && (
          <div className="p-8 text-center text-muted">
            Loading users...
          </div>
        )}
      </div>
    </div>
  );
}