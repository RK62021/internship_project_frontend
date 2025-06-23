// ui/Cards/RecentTaskSection.js

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CCard, CCardBody, CCardHeader, CBadge } from '@coreui/react'
import ApiUrl from '../../services/apiheaders'
import { UTC_TO_IND_FORMAT } from '../../utils/dateConvert'

const statusColors = {
  Completed: 'success',
  Open: 'info',
  Closed: 'secondary',
  Discard: 'warning',
  OverDue: 'danger',
  'Not Started': 'danger',
  'In Progress': 'primary',
}

const RecentTaskSection = () => {
  const [recentTasks, setRecentTasks] = useState([])

  useEffect(() => {
    axios.get(`${ApiUrl.User}/recent-task`)
      .then(res => setRecentTasks(res.data.data || []))
      .catch(() => setRecentTasks([]))
  }, [])

  return (
    <CCard className="mt-4 shadow-sm">
      <CCardHeader>
        <h5 className="mb-0 fw-bold">🕒 Recent Task Status (Last 2 Days)</h5>
      </CCardHeader>
      <CCardBody>
        {recentTasks.length === 0 ? (
          <p className="text-muted mb-0">No recent tasks found.</p>
        ) : (
          <ul className="list-group">
            {recentTasks.map(task => (
              <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{task.name}</strong> <small className="text-muted">({task.taskid})</small><br />
                  <small className="text-muted">Updated: {UTC_TO_IND_FORMAT(task.updatedAt)}</small>
                </div>
                <CBadge color={statusColors[task.status] || 'dark'}>{task.status}</CBadge>
              </li>
            ))}
          </ul>
        )}
      </CCardBody>
    </CCard>
  )
}

export default RecentTaskSection
