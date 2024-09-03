import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutes = () => {
  let tokenFromLocalStorage = localStorage.getItem("token");
  return tokenFromLocalStorage ? <Outlet /> : <Navigate to="/" />;
};

export { PrivateRoutes };
