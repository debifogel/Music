import FormToEnter from "../components/FormToEnter";
import authService from "../Services/Auth";
import { useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Home from "./Home";
import AvatarAndUpdate from "@/components/AvatarAndUpdate";
import { Avatar } from "@mui/material";

export default function AppLayout() {
  const [insite, setInsite] = useState<boolean>(() => {
    // קריאה ל-sessionStorage כדי לבדוק אם המשתמש מחובר
    return sessionStorage.getItem("insite") === "true";
  });       
  const logout = (b: boolean) => {
    setInsite(b); }
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // אם המשתמש לא מחובר ונסה לגשת לדפים אחרים, הפנייתו לדף הבית
    if (!insite && location.pathname !== "/") {
      navigate("/home");
    }
  }, [insite, location, navigate]);

  function register(email: string, password: string, name: string) {
    console.log(JSON.stringify( name))

    authService
      .register(name, email, password)
      .then(() => {
        console.log(JSON.stringify( name))
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
      {!insite && <>
        <div style={{position:"fixed",top:"50px",right:"10px"}}>
               <Avatar/>
          <FormToEnter
            buttonText="הרשמה"
            onSubmit={(email, password, name) => register(email, password, name || "")}
            register={true}
          />
          <FormToEnter
            buttonText="התחברות"
            onSubmit={(email, password) => login(email, password)}
            register={false}
          />
          </div>
          <Home/>
        </>}

      {insite && (
        <>
        
          <NavBar />
          <Outlet />
        </>
      )}
      {insite && <AvatarAndUpdate logout={() => logout(false)} />}

    </>
  );
}
