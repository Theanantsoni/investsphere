import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;