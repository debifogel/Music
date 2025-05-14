import { useEffect, useState } from "react";
import {  Outlet, useLocation, useNavigate } from "react-router-dom";
import { Alert, Avatar, Snackbar } from "@mui/material";

import authService from "../Services/Auth";
import FormToEnter from "../components/FormToEnter";
import { NavBar } from "../components/NavBar";
import AvatarAndUpdate from "@/components/AvatarAndUpdate";
import Home from "./Home";
import { AddSongButton } from "@/components/AddSongButton";

export default function AppLayout() {
  const [insite, setInsite] = useState<boolean>(() => {
    return sessionStorage.getItem("insite") === "true";
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const isAllowedPath =
      location.pathname === "/home" ||
      location.pathname.startsWith("/songs/public/");
  
    if (!insite && !isAllowedPath) {
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
        setAlertMessage("מצטערים, ארעה שגיאה בהרשמה");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
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
        setAlertMessage("אין הרשאת כניסה אנא נסה שוב או פנה למנהל המערכת");
        setTimeout(() => {
          setAlertMessage("");
        }, 3000);
        console.error("Login error:", err);
      });
  }   
      return (
        <>
          {!insite ? (
            <>
              <div style={
                { position: "fixed", top: "50px", right: "10px" }}>
                <Avatar />
                <FormToEnter
                  buttonText="הרשמה"
                  onSubmit={(email, password, name) =>
                    register(email, password, name || "")
                  }
                  register={true}/>
                  
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
         
              <NavBar />
              <Outlet />
              <AddSongButton />
              <AvatarAndUpdate logout={() => setInsite(false)} />
        </>
      )}
      { alertMessage && (
        <Snackbar
          open={!!alertMessage}
          autoHideDuration={3000}
          onClose={() => setAlertMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setAlertMessage("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}
      </>
      )}

