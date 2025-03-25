import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/zustandStore";
import UserTable from "../components/Admin/UserTable";
import Toolbar from "../components/Admin/Toolbar";
import axios from "axios";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { IoMdLogOut } from "react-icons/io";
import Logo from "@/assets/logo.jpg";
import Background from "@/assets/background.jpg";
const apiUrl = import.meta.env.VITE_API_URL;
// import LoadingSpinner from "@/components/LoadingSpinner";

const AdminPage = () => {
  const navigate = useNavigate();
  const { token, fetchUser, logout, isAuthenticated, user } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState(false); // Loading state for action

  const fetchUsers = async () => {
    try {
      setLoading(true); // Ensure loading is true when fetching users
      const res = await axios.get(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action: "block" | "unblock" | "delete") => {
    if (!selectedIds.length) {
      toast.error("Please select at least one user");
      return;
    }

    if (actionLoading) return; // Prevent re-triggering the action

    setActionLoading(true); // Set action loading state to true to block further actions

    const toastId = toast.loading("Processing..."); // Start loading toast

    try {
      const endpoint = {
        block: "users/block",
        unblock: "users/unblock",
        delete: "users/delete",
      }[action];

      const method = action === "delete" ? "DELETE" : "POST";

      const response = await axios({
        method,
        url: `${apiUrl}/${endpoint}`,
        data: { ids: selectedIds },
        headers: { Authorization: `Bearer ${token}` },
      });
      // on delete and block action if selectedIds include current user id then logout
      if (action === "delete" || action === "block") {
        if (user?.id !== undefined && selectedIds.includes(user.id)) {
          logout();
          navigate("/login");
        }
      }
      if (response && response.data) {
        toast.success(response.data.message, { id: toastId }); // Replace loading toast with success
      }

      await fetchUsers(); // Re-fetch users after action
      setSelectedIds([]); // Clear selected IDs
    } catch (error) {
      const err = error as any;

      // Only trigger error once if there's a failure
      if (err.response?.data?.message) {
        toast.error(err.response.data.message, { id: toastId }); // Replace loading toast with error
      } else {
        toast.error("Failed to unblock users", { id: toastId }); // Default error message
      }

      throw error; // Propagate the error
    } finally {
      setActionLoading(false); // Reset action loading state to allow further actions
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
    return (
      <div style={{ backgroundImage: `url(${Background})` }} className="flex  justify-center items-center h-screen w-screen bg-cover text-3xl  text-white ">
        Loading...
      </div>
    );
    // return <LoadingSpinner />;
  }

  return (
    <div className="h-screen flex justify-center items-center w-screen bg-cover" style={{ backgroundImage: `url(${Background})` }}>
      <div className="p-4 w-full max-w-6xl   mx-auto bg-white   rounded shadow-lg">
        <div className="md:flex justify-between items-center mb-4">
          <div className="md:flex items-center gap-4">
            {/* <img src={Logo} */}
            <img src={Logo} alt="Logo" className="w-24 mx-auto mb-4" />

            <h1 className="text-2xl text-center  font-bold">Admin Panel</h1>
          </div>

          <div className=" my-5 md:mt-0  justify-center md:justify-start  flex items-center">
            <span className="mr-4">Welcome, {user?.name}</span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"destructive"} onClick={logout}>
                  <IoMdLogOut />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <Toolbar
          selectedIds={selectedIds}
          onBlock={() => handleUserAction("block")}
          onUnblock={() => handleUserAction("unblock")}
          onDelete={() => handleUserAction("delete")}
          // actionLoading={actionLoading} // Pass loading state to prevent re-triggering action
        />

        <UserTable users={users} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
      </div>
    </div>
  );
};

export default AdminPage;
