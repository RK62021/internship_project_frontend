import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

import ApiUrl from '../../services/apiheaders'
import DashboardCard from '../../components/dashboard/dashboardCard'
import DashboardTaskCard from '../../ui/Cards/dashBoardTaskCard'
import UserTaskTable from './dashboardTable'
import RecentTaskSection from './RecentTaskSection'
import MainChart from './MainChart'
import Loader from '../../ui/Loader'
import { UTC_TO_IND_FORMAT } from '../../utils/dateConvert'

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

  const [taskCount, setTaskCount] = useState([])
  const [apiTask, setApiTask] = useState([])
  const [activeTab, setActiveTab] = useState('my')

  const [isTaskCountLoading, setIsTaskCountLoading] = useState(false)
  const [isTaskListLoading, setIsTaskListLoading] = useState(false)

  // Fetch task count for summary cards
  const fetchTaskCount = async () => {
    setIsTaskCountLoading(true)
    try {
      const res = await axios.get(`${ApiUrl.User}/taskcountstatuswise?userId=${user_id}&userType=${userType}`)
      if (res.status === 200) updateTaskCount(res.data.data)
    } catch {
      toast.error('Error fetching task count')
    } finally {
      setIsTaskCountLoading(false)
    }
  }

  const updateTaskCount = (data) => {
    const desiredOrder = ['Not Started', 'In Progress', 'Completed', 'OverDue']
    const colorMap = {
      'Not Started': 'info',
      'In Progress': 'warning',
      Completed: 'success',
      OverDue: 'danger',
    }

    const sorted = desiredOrder.map((status) => {
      const match = data.find((item) => item.name.toLowerCase() === status.toLowerCase())
      return {
        id: match?.id || '',
        name: status,
        count: match?.count || 0,
        color: colorMap[status],
      }
    })

    setTaskCount(sorted)
  }

  // Fetch tasks list
  const fetchTasks = async (type) => {
    setIsTaskListLoading(true)
    try {
      const endpoint = type === 'my' ? 'mytask' : 'teamtask'
      const res = await axios.get(`${ApiUrl.User}/task/${endpoint}?userId=${user_id}&userType=${userType}`)
      if (res.status === 200) setApiTask(res.data.data)
    } catch {
      toast.error('Something went wrong...')
    } finally {
      setIsTaskListLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    fetchTasks(tab)
  }

  useEffect(() => {
    fetchTaskCount()
    fetchTasks('my')
  }, [])

  useEffect(() => {
    if (isLogin) {
      toast.success('Welcome to Dashboard!', { autoClose: 1200, hideProgressBar: true })
    }
  }, [isLogin])

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Dashboard Title */}
      <div className="mb-4 border-bottom pb-2">
        <h3 className="fw-bold mb-1">📋 Task Dashboard</h3>
        <p className="text-muted">Track and manage your team’s work effectively</p>
      </div>

      {/* Task Summary Cards */}
      <section className="mb-5">
        <h5 className="mb-3 fw-semibold">🔢 Task Status Summary</h5>
        <div className="row g-4">
          {isTaskCountLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div className="col-sm-6 col-lg-4 col-xxl-3" key={idx}>
                  <div className="p-4 bg-light rounded placeholder-glow w-100" style={{ height: 100 }} />
                </div>
              ))
            : taskCount.map((card, idx) => (
                <div className="col-sm-6 col-lg-4 col-xxl-3" key={idx}>
                  <DashboardCard data={card} />
                </div>
              ))}
        </div>
      </section>

      {/* Monthly Chart (Admins only) */}
      {userType !== 'User' && (
        <section className="mt-5">
          <div className="w-100 h-100 overflow-hidden">
            <div className="p-3 bg-white rounded">
              <div className="chart-wrapper" style={{ height: '100%', minHeight: '300px' }}>
                <MainChart />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* My / Team Tasks */}
      <section className="mb-5 mt-4">
        <h5 className="fw-semibold mb-3">🗂️ Task Overview</h5>
        <ul className="nav nav-pills mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => handleTabChange('my')}
            >
              My Tasks
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => handleTabChange('team')}
            >
              My Team Tasks
            </button>
          </li>
        </ul>

        {isTaskListLoading ? (
          <div className="row g-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="p-4 bg-light rounded placeholder-glow" style={{ height: 180 }} />
              </div>
            ))}
          </div>
        ) : apiTask.length === 0 ? (
          <div className="text-center text-muted py-5 fw-semibold fs-5">
            🚫 No {activeTab === 'team' ? 'Team' : 'My'} Tasks Found
          </div>
        ) : (
          <div className="row g-4">
            {apiTask.map((item, idx) => {
              const statusColor = taskBadgeColor.find((color) => color.name === item.status)?.color
              return (
                <div className="col-md-6 col-lg-3" key={idx}>
                  <DashboardTaskCard
                    OriginalId={item._id}
                    id={item.taskid}
                    taskName={item.name}
                    taskDesc={item.details}
                    assignedDate={item.createdDate ? UTC_TO_IND_FORMAT(item.createdDate) : ''}
                    completionDate={item.targetdate ? UTC_TO_IND_FORMAT(item.targetdate) : ''}
                    status={item.status}
                    assignto={item.assignto}
                    createdBy={item.createdby}
                    priority={item.priority}
                    taskId={item._id}
                    color={statusColor}
                  />
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Team Table & Recent Tasks */}
      <section className="mt-5">
  <div className="row align-items-stretch">
    {userType !== 'User' && (
      <div className="col-lg-7 mb-4 mb-lg-0 d-flex flex-column">
        <div className="h-100 border rounded p-3 bg-white d-flex flex-column">
          <div className="flex-grow-1 overflow-auto">
            <UserTaskTable />
          </div>
        </div>
      </div>
    )}

    <div className={`${userType === 'User' ? 'col-12' : 'col-lg-5'} d-flex flex-column`}>
      <div className="h-100 border rounded p-3 shadow-sm bg-white d-flex flex-column">
        <h5 className="fw-semibold mb-3">🕒 Recently Updated Tasks</h5>
        <div className="flex-grow-1 overflow-hidden">
          <RecentTaskSection />
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default Dashboard
