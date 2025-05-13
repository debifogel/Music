import { useEffect, useState } from "react";
import {  Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

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
        <>
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
              <NavBar />
              <Outlet />
              <AddSongButton />
              <AvatarAndUpdate logout={() => setInsite(false)} />
            </>
          )}

        </>
      );
}
