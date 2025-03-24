import React, { useEffect, useRef } from "react";

interface User {
  id: number; // Changed to number to match backend expectations
  name: string;
  email: string;
  last_login: string;
  status: "active" | "blocked";
}

interface UserTableProps {
  users: User[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};

const UserTable: React.FC<UserTableProps> = ({ users, selectedIds, setSelectedIds }) => {
  const selectAllRef = useRef<HTMLInputElement>(null);
  const allSelected = selectedIds.length === users.length && users.length > 0;
  const someSelected = selectedIds.length > 0 && selectedIds.length < users.length;

  // Handle indeterminate state for select all checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const toggleUserSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : users.map((user) => user.id));
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">
            <input type="checkbox" ref={selectAllRef} checked={allSelected} onChange={toggleSelectAll} />
          </th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Last Login</th>
          <th className="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className={selectedIds.includes(user.id) ? "bg-gray-100" : ""}>
            <td className="border p-2">
              <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleUserSelection(user.id)} />
            </td>
            <td className="border p-2">{user.name}</td>
            <td className="border p-2">{user.email}</td>
            <td className="border p-2">{formatDate(user.last_login)}</td>
            <td className="border p-2">
              <span className={`px-2 py-1 rounded ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{user.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
