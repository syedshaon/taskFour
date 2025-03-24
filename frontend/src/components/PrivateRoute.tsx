import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/zustandStore";

const PrivateRoute = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
