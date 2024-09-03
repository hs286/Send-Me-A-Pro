import { Navigate } from "react-router-dom";

function ClientRoute({ children }: any) {
  let tokenFromLocalStorage = localStorage.getItem("provider");

  if (tokenFromLocalStorage) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/provider-profile" />;
  }

  // authorized so return child components
  return children;
}
export { ClientRoute };
