import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/zustandStore";
import toast from "react-hot-toast";
import Spinner from "../Spinner";

interface ToolbarProps {
  selectedIds: number[];
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
}

const Toolbar = ({ selectedIds, onBlock, onUnblock, onDelete }: ToolbarProps) => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState<"block" | "unblock" | "delete" | null>(null);

  const handleAction = async (action: "block" | "unblock" | "delete") => {
    if (!selectedIds.length) {
      toast.error("Please select at least one user");
      return;
    }

    if (action === "delete" && !confirm(`Permanently delete ${selectedIds.length} user(s)?`)) {
      return;
    }

    setLoading(action);
    try {
      const endpoint = {
        block: "/api/users/block",
        unblock: "/api/users/unblock",
        delete: "/api/users/delete",
      }[action];

      await axios({
        method: action === "delete" ? "DELETE" : "POST",
        url: `http://localhost:5000${endpoint}`,
        data: { ids: selectedIds },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Successfully ${action}ed ${selectedIds.length} user(s)`);

      if (action === "block") onBlock();
      if (action === "unblock") onUnblock();
      if (action === "delete") onDelete();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || `${action} operation failed` : `${action} operation failed`;

      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex space-x-2 mb-4">
      <button onClick={() => handleAction("block")} disabled={!selectedIds.length || !!loading} className="btn-danger cursor-pointer">
        {loading === "block" ? <Spinner /> : "Block"}
      </button>

      <button onClick={() => handleAction("unblock")} disabled={!selectedIds.length || !!loading} className="btn-success cursor-pointer">
        {loading === "unblock" ? <Spinner /> : "Unblock"}
      </button>

      <button onClick={() => handleAction("delete")} disabled={!selectedIds.length || !!loading} className="btn-warning cursor-pointer">
        {loading === "delete" ? <Spinner /> : "Delete"}
      </button>
    </div>
  );
};

export default Toolbar;
