import React, { useEffect, useState } from 'react'
import { CCol, CNav, CNavItem, CNavLink, CRow } from '@coreui/react'
import DashboardCard from '../../components/dashboard/dashboardCard'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { UTC_TO_IND_FORMAT } from '../../utils/dateConvert'
import DashboardTaskCard from '../../ui/Cards/dashBoardTaskCard'
import ApiUrl from '../../services/apiheaders'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../../ui/Loader'
import UserTaskTable from './dashboardTable'
import RecentTaskSection from './RecentTaskSection'
import MainChart from './MainChart'

const taskBadgeColor = [
  { name: 'OverDue', color: 'danger' },
  { name: 'Completed', color: 'success' },
  { name: 'Not Started', color: 'info' },
  { name: 'In Progress', color: 'warning' },
]

const Dashboard = () => {
  const location = useLocation()
  const isLogin = location.state?.isLogin
  const user_id = useSelector((state) => state.userId)
  const userType = useSelector((state) => state.userType)

  const [apiTask, setapiTask] = useState([])
  const [taskCount, setTaskCount] = useState([])
  const [activeTab, setActiveTab] = useState('my')
  const [isLoading, setIsLoading] = useState(false)

  const fetchTasks = async (type) => {
    setIsLoading(true)
    try {
      const endpoint = type === 'my' ? 'mytask' : 'teamtask'
      const response = await axios.get(`${ApiUrl.User}/task/${endpoint}?userId=${user_id}&userType=${userType}`)
      if (response.status === 200) setapiTask(response.data.data)
    } catch {
      toast.error('Something went wrong...')
    } finally {
      setIsLoading(false)
    }
  }

  const HandleActiveTab = async (tab) => {
    setActiveTab(tab)
    await fetchTasks(tab)
  }

  const UpdateData = (apiData) => {
    const desiredOrder = ['Not Started', 'In Progress', 'Completed', 'OverDue']
    const colorMap = {
      'Not Started': 'info',
      'In Progress': 'warning',
      'Completed': 'success',
      'OverDue': 'danger',
    }
    const sortedData = desiredOrder.map((status) => {
      const match = apiData.find((item) => item.name.toLowerCase() === status.toLowerCase())
      return {
        id: match?.id || '',
        name: status,
        count: match?.count || 0,
        color: colorMap[status] || 'secondary',
      }
    })
    setTaskCount(sortedData)
  }

  const fetchTaskCount = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${ApiUrl.User}/taskcountstatuswise?userId=${user_id}&userType=${userType}`)
      if (response.status === 200) UpdateData(response.data.data)
    } catch {
      toast.error('Error fetching task count')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTaskCount()
    fetchTasks('my')
  }, [])

  useEffect(() => {
    if (isLogin) {
      toast.success('Welcome to Dashboard!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: true,
      })
    }
  }, [isLogin])

  return (
    <>
      {isLoading && <Loader />}

      {/* Section 1: Task Status Summary */}
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="fw-bold">📋 Task Dashboard</h4>
        </div>
      {/* <h5 className="fw-bold mb-3">📌 Task Summary</h5> */}
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        {taskCount?.map((card, idx) => (
          <CCol sm={6} xl={4} xxl={3} key={idx}>
            <DashboardCard data={card} />
          </CCol>
        ))}
      </CRow>

      {/* Section 2: Task Filters */}
      {/* <h5 className="fw-bold mb-3">📂 View Tasks</h5> */}
      <CRow>
        <CCol xs>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink
                style={{ cursor: 'pointer' }}
                active={activeTab === 'my'}
                onClick={() => HandleActiveTab('my')}
              >
                My Tasks
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                style={{ cursor: 'pointer' }}
                active={activeTab === 'team'}
                onClick={() => HandleActiveTab('team')}
              >
                My Team Tasks
              </CNavLink>
            </CNavItem>
          </CNav>

          {/* Section 3: Task Cards */}
          <div className="px-0 py-4">
            {apiTask?.length === 0 ? (
              <div className="text-center text-muted py-5 fw-semibold fs-5">
                🚫 No {activeTab === 'team' ? 'Team' : 'My'} Tasks Found
              </div>
            ) : (
              <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
                {apiTask?.map((item, idx) => {
                  const statusColor = taskBadgeColor.find((colorItem) => colorItem.name === item.status)?.color
                  return (
                    <CCol xs key={idx}>
                      <DashboardTaskCard
                        OriginalId={item._id}
                        id={item.taskid}
                        taskName={item.name}
                        taskDesc={item.details}
                        assignedDate={item ? UTC_TO_IND_FORMAT(item.createdDate) : null}
                        completionDate={item ? UTC_TO_IND_FORMAT(item.targetdate) : null}
                        status={item.status}
                        assignto={item.assignto}
                        createdBy={item.createdby}
                        taskId={item._id}
                        OnDeleteTask={() => {}}
                        OnEditTask={() => {}}
                        color={statusColor}
                      />
                    </CCol>
                  )
                })}
              </CRow>
            )}
          </div>
        </CCol>
      </CRow>

      {/* Section 4: Team Task Table */}
      {userType !== 'User' && (
        <>
          {/* <h5 className="fw-bold mt-4">👥 Team Task Overview</h5> */}
          <CRow className="mt-2">
            <CCol xs={12}>
              {/* <div className="card shadow-sm border-0">
                <div className="card-body p-3"> */}
                  <UserTaskTable />
                {/* </div>
              </div> */}
            </CCol>
          </CRow>
        </>
      )}

      {/* Section 5: Recent Tasks */}
      {/* <h5 className="fw-bold mt-4">🕑 Recent Tasks</h5> */}
      <RecentTaskSection />

      {/* Section 6: Task Status Chart */}
      {userType !== 'User' && (
        <>
          <h5 className="fw-bold mt-4">📊 Monthly Task Status Overview</h5>
          <CRow className="mt-2">
            <CCol xs={12}>
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="chart-wrapper" style={{ minHeight: '300px', overflowX: 'auto' }}>
                    <MainChart />
                  </div>
                </div>
              </div>
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default Dashboard