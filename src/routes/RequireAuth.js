import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
