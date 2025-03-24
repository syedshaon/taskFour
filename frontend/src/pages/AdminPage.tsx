import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/zustandStore";
import UserTable from "../components/Admin/UserTable";
import Toolbar from "../components/Admin/Toolbar";
import axios from "axios";
import toast from "react-hot-toast";

const AdminPage = () => {
  const navigate = useNavigate();
  const { token, fetchUser, logout, isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleUserAction = async (action: "block" | "unblock" | "delete") => {
    if (!selectedIds.length) {
      toast.error("Please select at least one user");
      return;
    }

    try {
      const endpoint = {
        block: "/api/users/block",
        unblock: "/api/users/unblock",
        delete: "/api/users/delete",
      }[action];

      const method = action === "delete" ? "DELETE" : "POST";

      await axios({
        method,
        url: `http://localhost:5000${endpoint}`,
        data: { ids: selectedIds },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Users ${action}ed successfully`);
      await fetchUsers();
      setSelectedIds([]);
    } catch (error) {
      console.error(`Failed to ${action} users:`, error);
      toast.error(`Failed to ${action} users`);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchUser();
        if (isAuthenticated) {
          await fetchUsers();
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [fetchUser, isAuthenticated]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={logout} className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <Toolbar selectedIds={selectedIds} onBlock={() => handleUserAction("block")} onUnblock={() => handleUserAction("unblock")} onDelete={() => handleUserAction("delete")} />

      <UserTable users={users} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
    </div>
  );
};

export default AdminPage;
