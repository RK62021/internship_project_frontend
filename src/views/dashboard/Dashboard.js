import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { UTC_TO_IND_FORMAT } from '../../utils/dateConvert'
import ApiUrl from '../../services/apiheaders'

import DashboardCard from '../../components/dashboard/dashboardCard'
import DashboardTaskCard from '../../ui/Cards/dashBoardTaskCard'
import UserTaskTable from './dashboardTable'
import RecentTaskSection from './RecentTaskSection'
import MainChart from './MainChart'
import Loader from '../../ui/Loader'

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

  const [apiTask, setApiTask] = useState([])
  const [taskCount, setTaskCount] = useState([])
  const [activeTab, setActiveTab] = useState('my')
  const [isLoading, setIsLoading] = useState(false)

  const fetchTasks = async (type) => {
    setIsLoading(true)
    try {
      const endpoint = type === 'my' ? 'mytask' : 'teamtask'
      const res = await axios.get(`${ApiUrl.User}/task/${endpoint}?userId=${user_id}&userType=${userType}`)
      if (res.status === 200) setApiTask(res.data.data)
    } catch {
      toast.error('Something went wrong...')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTaskCount = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${ApiUrl.User}/taskcountstatuswise?userId=${user_id}&userType=${userType}`)
      if (res.status === 200) updateTaskCount(res.data.data)
    } catch {
      toast.error('Error fetching task count')
    } finally {
      setIsLoading(false)
    }
  }

  const updateTaskCount = (data) => {
    const desiredOrder = ['Not Started', 'In Progress', 'Completed', 'OverDue']
    const colorMap = {
      'Not Started': 'info',
      'In Progress': 'warning',
      'Completed': 'success',
      'OverDue': 'danger',
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
    <>
      {isLoading && <Loader />}

      <div className="container-fluid py-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">📋 Task Dashboard</h4>
        </div>

        {/* Task Summary Cards */}
        <div className="row g-4 mb-4">
          {taskCount.map((card, idx) => (
            <div className="col-sm-6 col-lg-4 col-xxl-3" key={idx}>
              <DashboardCard data={card} />
            </div>
          ))}
        </div>

        {/* Tabs for My Tasks / Team Tasks */}
        <ul className="nav nav-tabs mb-3">
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

        {/* Task Cards */}
        <div className="py-3">
          {apiTask.length === 0 ? (
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
        </div>

        {/* Team Task Table */}
        {userType !== 'User' && (
          <div className="mt-5">
            <UserTaskTable />
          </div>
        )}

        {/* Recent Tasks */}
        <div className="mt-5">
          <RecentTaskSection />
        </div>

        {/* Task Status Chart */}
        {userType !== 'User' && (
          <div className="mt-5">
            <h5 className="fw-bold mb-3">📊 Monthly Task Status Overview</h5>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="chart-wrapper" style={{ minHeight: '300px', overflowX: 'auto' }}>
                  <MainChart />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard
