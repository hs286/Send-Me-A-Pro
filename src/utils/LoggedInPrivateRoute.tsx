import { Navigate, Outlet } from "react-router-dom";

const LoggedInPrivateRoutes = () => {
  let tokenFromLocalStorage = localStorage.getItem("token");
  return !tokenFromLocalStorage ? <Outlet /> : <Navigate to="/" />;
};

export { LoggedInPrivateRoutes };
