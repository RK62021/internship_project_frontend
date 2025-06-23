import axios from "axios";
import ApiUrl from "../../services/apiheaders";

export const StatusOption=async()=>{
    try {
        const response = await axios.get(`${ApiUrl.User}/taskstatus`); // adjust your API endpoint
        return response?.data?.data;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
      }
}