import Buttons from "../views/buttons/buttons/Buttons";
import Dashboard from "../views/dashboard/Dashboard";
import CoreUIIcons from "../views/icons/coreui-icons/CoreUIIcons";
import Reports from "../views/pages/reports/Report";
import Setting from "../views/pages/settings/Setting";
import Task from "../views/pages/tasks/Task";
import TaskDetailsPage from "../views/pages/tasks/TaskDetails";
import Team from "../views/pages/teams/Team";
import AddUser from "../views/pages/user/adduser";
import UserList from "../views/pages/user/userlist";
import UserCardList from "../views/pages/user/userlist/user-grid";


 const PrivateRoutes=[
   {isPrivate:true,path:"/dashboard",element:<Dashboard/>},
   {isPrivate:true,path:"/task",element:<Task/>},
   {isPrivate:true,path:"/team",element:<Team/>},
   {isPrivate:true,path:"/user-list",element:<UserCardList/>},
   {isPrivate:true,path:"/add-user",element:<AddUser/>},
   {isPrivate:true,path:"/report",element:<Reports/>},
   {isPrivate:true,path:"/settings",element:<Setting/>},
   {isPrivate:true,path:"/task/:id",element:<TaskDetailsPage/>},
];

export default PrivateRoutes;

