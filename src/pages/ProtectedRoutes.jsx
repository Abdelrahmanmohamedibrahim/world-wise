import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoutes({ children }) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!isAuth) navigate("/");
    },
    [navigate, isAuth]
  );
  return isAuth ? children : null;
}

export default ProtectedRoutes;
