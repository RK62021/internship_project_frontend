import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ApiUrl from '../../services/apiheaders'
import { formatDateToDMYHM } from '../../utils/dateConvert'
import { useSelector } from 'react-redux'

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
  const userType = useSelector((state) => state.userType)
  const userId = useSelector((state) => state.userId)

  useEffect(() => {
    axios
      .get(`${ApiUrl.User}/recent-task?userType=${userType}&userId=${userId}`)
      .then((res) => setRecentTasks(res.data.data || []))
      .catch(() => setRecentTasks([]))
  }, [])

  return (
    <section className="mt-3">
      {recentTasks.length === 0 ? (
        <div className="text-center text-muted py-5 bg-light rounded border fw-medium">
          📭 No recent tasks found.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {recentTasks.slice(0, 5).map((task) => (
            <div
              key={task._id}
              className="border rounded shadow-sm px-3 py-2 d-flex justify-content-between align-items-center bg-white hover-shadow transition"
            >
              <div className="text-truncate" style={{ maxWidth: '75%' }}>
                <div className="fw-semibold text-truncate">{task.name}</div>
                <div className="small text-muted text-truncate">
                  #{task.taskid} • Updated: {formatDateToDMYHM(task.updatedDate)}
                </div>
              </div>
              <span
                className={`badge bg-${statusColors[task.Taskstatus] || 'dark'} text-capitalize px-3 py-2 rounded-pill`}
              >
                {task.Taskstatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecentTaskSection
