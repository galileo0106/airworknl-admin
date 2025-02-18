import "./App.css";
import "react-quill/dist/quill.snow.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./router/routes";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

function App() {
  const { token, logout } = useAuth();
  // useEffect(() => {
  //   let timer;
  //   const resetTimer = () => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       logout();
  //     }, 1000 * 60 * 30); //logout if inactive within 30 mins
  //   };

  //   document.addEventListener("mousemove", resetTimer);
  //   document.addEventListener("keydown", resetTimer);
  //   resetTimer();
  //   return () => {
  //     document.removeEventListener("mousemove", resetTimer);
  //     document.removeEventListener("keydown", resetTimer);
  //     clearTimeout(timer);
  //   };
  // }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // await getUserInfor(logout);
      } catch (err) {}
    };

    if (token) initAuth();
  }, [token]);
  return <RouterProvider router={routes} />;
}

export default App;
