import Login from "../views/pages/login/Login";
import MyLogin from "../views/pages/mylogin/myLogin";
import MySignup from "../views/pages/mysignup/mySignup";
import Page404 from "../views/pages/page404/Page404";
import Page500 from "../views/pages/page500/Page500";
import Register from "../views/pages/register/Register";



// defined public routes
 const PublicRoutes=[
  {isPrivate:false,path:"/",element:<MyLogin/>},
   {isPrivate:false,path:"/login",element:<MyLogin/>},
   {isPrivate:false,path:"/register",element:<MySignup/>},
   {isPrivate:false,path:"/500",element:<Page500/>},
   {isPrivate:false,path:"/404",element:<Page404/>},
   // {isPrivate:false,path:"/mylogin",element:<Login/>},

   // {isPrivate:false,path:"/myregister",element:<Register/>},

];
export default PublicRoutes;



