const apiUrl = import.meta.env.VITE_API_BASE_URL;
// console.log(apiUrl);
const ApiUrl={
   Login: `${apiUrl}/api/v1/auth/login`,
   Register: `${apiUrl}/api/v1/auth/register`,
   Logout: `${apiUrl}/api/v1/auth/logout`,
   changeRole: `${apiUrl}/api/v1/auth/change-role`,
   User:`${apiUrl}/api/v1/user`,
   Team:`${apiUrl}/api/v1/team`,
   getProfile: `${apiUrl}/api/v1/user/userProfile`,
   updateProfile: `${apiUrl}/api/v1/user/updateProfile`,


}

export default ApiUrl;