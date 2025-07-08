import { CCol, CRow } from '@coreui/react'
import '../styles/style.css'
import Button from '../../../ui/buttons'
import { CIcon } from '@coreui/icons-react'
import { cilDescription, cilPaperclip } from '@coreui/icons' // Notes and File Attachment
import { useEffect, useState } from 'react'
import PopupLayout from '../../../layout/PopupLayout.js'
import MultiSelectTabs from '../../../ui/multiSelectTab/index.js'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import ApiUrl from '../../../services/apiheaders.js'

const TaskDetailsPage = () => {
  const { id } = useParams();
  // console.log("id in params----------",id);
    const [isUpdated,setisUpdated]=useState(false)

    const [TaskDetail,setTaskDetail]=useState(null);
  
    const fetchTask=async()=>{
      const Response = await axios.get(`${ApiUrl.User}/task/details?id=${id}`);
      if (Response.status == 200) {
        setTaskDetail(Response.data.data)
        console.log("Task Details Response",Response.data.data);
      }
    }

    const TaskUpdatedMessege=()=>{
      toast.success("Task Updated")
    }
  
    useEffect(() => {
      fetchTask()
    }, [isUpdated])
  return (
    <>
    <div style={{ padding: '20px' , bagroundColor: '#f8f9fa'}}>
    <ToastContainer   />
    <MultiSelectTabs taskId={id} data={TaskDetail?.task || []} notesData={TaskDetail?.notes || null} update={()=>{setisUpdated((prev)=>!prev);TaskUpdatedMessege()}}/>
    </div>
    </>
  )
}

export default TaskDetailsPage
