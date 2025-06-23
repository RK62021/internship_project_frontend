import { Navigate } from "react-router-dom";
import DefaultLayout from "./DefaultLayout";
import { GetLocalStorage } from "../services/localStorageService";

 const PrivateRoutesLayout=()=>{
    return GetLocalStorage('isLogin') ? <DefaultLayout/> : <Navigate to="/" replace />;

 };

 export default PrivateRoutesLayout;