import { useAuthStore } from "../store/zustandStore";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold">
          User Management
        </Link>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span className="mr-4">Welcome, {user?.email}</span>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/register" className="mr-4">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
