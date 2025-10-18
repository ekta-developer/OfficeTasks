import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./AppCss.css";
import "./MediaQuery.css";
import AppRouter from "./router/AppRouter";
import { CircularProgress } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // full viewport height
            width: "100%", // full width
          }}
        >
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <>
          <AppRouter />;
        </>
      )}
    </>
  );
}

export default App;
