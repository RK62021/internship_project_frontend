import {LineGraph,BarGraph} from "../components/dashboard/dashboardGraph"
export const DashboardTaskCount=[
    {id:1,name:"Completed",count:0,color:"success",graphView:<LineGraph/>},
    {id:2,name:"In Progress",count:0,color:"warning",graphView:<BarGraph/>},
    {id:2,name:"OverDue",count:0,color:"danger",graphView:<LineGraph/>},
    {id:4,name:"Not Started",count:0,color:"info",graphView:<BarGraph/>},
]




export const TeamData=[
    {id:1,name:"Completed Task",count:0,color:"info",graphView:<LineGraph/>},
    {id:2,name:"In Progress",count:0,color:"warning",graphView:<BarGraph/>},
    {id:2,name:"OverDue Task",count:0,color:"danger",graphView:<LineGraph/>},
    {id:4,name:"Not Started",count:0,color:"success",graphView:<BarGraph/>},
]


export const Color=[
    "info","warning","danger","success"
]