import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import authService from "../Services/Auth";
import FormToEnter from "../components/FormToEnter";
import { NavBar } from "../components/NavBar";
import AvatarAndUpdate from "@/components/AvatarAndUpdate";
import Home from "./Home";

// יצירת נושא מותאם
const theme = createTheme();

// כפתור הוספת שיר
const AddButton = styled(Link)(({ theme }) => ({
  position: "fixed",
  bottom: 20,
  left: 90,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  textDecoration: "none",
  overflow: "hidden",
  transition: "all 0.3s ease",
  padding: "0 12px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",

  "& .text": {
    marginLeft: 8,
    opacity: 0,
    whiteSpace: "nowrap",
    transition: "opacity 0.3s",
  },

  "&:hover": {
    width: 130,
    borderRadius: 20,
  },

  "&:hover .text": {
    opacity: 1,
  },
}));

export default function AppLayout() {
  const [insite, setInsite] = useState<boolean>(() => {
    return sessionStorage.getItem("insite") === "true";
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!insite && location.pathname !== "/home") {
      navigate("/home");
    }
  }, [insite, location, navigate]);

  function register(email: string, password: string, name: string) {
    authService
      .register(name, email, password)
      .then(() => {
        sessionStorage.setItem("insite", "true");
        setInsite(true);
      })
      .catch((err) => {
        alert("מצטערים, ארעה שגיאה בהרשמה");
        console.error("Registration error:", err);
      });
  }

  function login(email: string, password: string) {
    authService
      .login(email, password)
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem("insite", "true");
          setInsite(true);
        } else {
          alert("מצטערים, ארעה שגיאה בהתחברות");
          console.error("Login error:", res);
        }
      })
      .catch((err) => {
        alert("מצטערים, ארעה שגיאה בהתחברות");
        console.error("Login error:", err);
      });
  }

  return (
    <ThemeProvider theme={theme}>
      {!insite ? (
        <>
          <div style={{ position: "fixed", top: "50px", right: "10px" }}>
            <Avatar />
            <FormToEnter
              buttonText="הרשמה"
              onSubmit={(email, password, name) =>
                register(email, password, name || "")
              }
              register={true}
            />
            <FormToEnter
              buttonText="התחברות"
              onSubmit={(email, password) => login(email, password)}
              register={false}
            />
          </div>
          <Home />
        </>
      ) : (
        <>
          <AddButton to="/add-song">
            <AddIcon />
            <span className="text">הוסף שיר</span>
          </AddButton>
          <NavBar />
          <Outlet />
          <AvatarAndUpdate logout={() => setInsite(false)} />
        </>
      )}
    </ThemeProvider>
  );
}
