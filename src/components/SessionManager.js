import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function SessionManager() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const publicRoutes = ["/", "/signup"];
      const isPublicRoute = publicRoutes.includes(location.pathname);
      if (user) {

        if (isPublicRoute) {
          navigate("/upload");
        }
        //navigate("/upload");
      } else {

        if (!isPublicRoute) {
          navigate("/");
        }
        //navigate('/')
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [navigate, location]);

  return null; // This component doesn't render anything itself
}

export default SessionManager;
