import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ApiUrl from '../../services/apiheaders'
import { formatDateToDMYHM } from '../../utils/dateConvert'

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
    axios
      .get(`${ApiUrl.User}/recent-task`)
      .then((res) => setRecentTasks(res.data.data || []))
      .catch(() => setRecentTasks([]))
  }, [])

  return (
    <section className="mt-4">
      {recentTasks.length === 0 ? (
        <div className="text-muted text-center py-4 border rounded bg-light">
          No recent tasks found.
        </div>
      ) : (
        <div className="row g-3">
          {recentTasks.slice(0, 5).map((task) => (
            <div key={task._id} className="col-12">
              <div className="card shadow-sm border-0 rounded-3">
                <div
                  className="card-body d-flex justify-content-between align-items-center flex-wrap"
                  style={{ overflowX: 'hidden' }}
                >
                  <div className="pe-3 text-truncate" style={{ maxWidth: '75%' }}>
                    <h6 className="fw-semibold mb-1 text-truncate">{task.name}</h6>
                    <div className="text-muted small text-truncate">
                      #{task.taskid} • Updated: {formatDateToDMYHM(task.updatedDate)}
                    </div>
                  </div>
                  <span
                    className={`badge bg-${statusColors[task.Taskstatus] || 'dark'} rounded-pill px-3 py-2 text-capitalize text-nowrap`}
                  >
                    {task.Taskstatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default RecentTaskSection
