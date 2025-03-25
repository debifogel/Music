import FormToEnter from "../components/FormToEnter";
import authService from "../Services/Auth";
import { setUser } from "../Store/UStore";
import { log } from "console";
import { NavBar } from "../components/NavBar";
import {  useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
let [insite,setinsite]=useState(false)//)
 function updateLocalUser(name:string,email:string)
 {
  setUser({username:name,email:email})
  setinsite(true)
 } 
function register(email: string, password: string, name: string) {
    authService.register(name, email, password).then(() => {      
      updateLocalUser(name,email)
   })
    .catch((err) => {
      alert("מצטערים ארתה שגיאה בהרשמה");
      log("error", err);
    });
}
// useEffect(() => {
  
// if(localStorage.getItem("token")!=null&&localStorage.getItem("token")!=undefined)
// {
//   const token=localStorage.getItem("token")||""
//   const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
//       const name = decodedToken.claims?.Name || decodedToken.Name;
//       const email = decodedToken.claims?.Email || decodedToken.Email;
//       updateLocalUser(name, email);
// setinsite(true)
// }
// }, [])

function login(email: string, password: string) {
  authService.login( email, password).then((res) =>  {
    if (res.status == 200) {
      const token = res.data.token;
      const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
      const name = decodedToken.claims?.Name || decodedToken.Name;
      updateLocalUser(name, email);
      console.log("success")
    } else {
      alert("מצטערים ארתה שגיאה בהרשמה");
      console.log("error", res);

    }})
.catch((err) => {
  alert("מצטערים ארתה שגיאה בהרשמה");
  console.log("error", err);});

}
  return (
    <>
{!insite&&<FormToEnter buttonText="הרשמה" onSubmit={(email,password,name)=>{register(email,password,name||"")}} register={true}/>}
{!insite&&<FormToEnter buttonText="התחברות" onSubmit={(email,password)=>login( email,password)} register={false}/>}
<Link to="/home"/>
{insite&&<NavBar/>}
<Outlet/>
    </>
  )
}
//איך לטעון את הוספת שירים
//לסדר כל שיר שיהיה טוב
//לסדר תיקיות ועוד
//לבדוק מה עם המשתמש
//לסדר עיצוב