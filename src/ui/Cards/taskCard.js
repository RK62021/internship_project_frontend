import React, { useCallback, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CBadge,
  CTooltip,
  CButton,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useSelector } from 'react-redux'
import Loader from '../Loader'
import ApiUrl from '../../services/apiheaders'

const TaskCard = ({
  color,
  OriginalId,
  taskName,
  assignedDate,
  completionDate,
  status,
  id,
  assignto,
  OnDeleteTask,
  createdBy,
  priority,
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.userType)

  const handleOpenTask = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${ApiUrl.User}/task/firsttimeopen?taskId=${OriginalId}`)
      if (res.data.statusCode === 200) {
        navigate(`/task/${OriginalId}`)
      } else {
        toast.error('Something went wrong...')
      }
    } catch (error) {
      console.error('API call failed:', error)
      toast.error('Something went wrong...')
    } finally {
      setIsLoading(false)
    }
  }, [navigate, OriginalId])

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'secondary'
    }
  }

  return (
    <>
      {isLoading && <Loader />}

      <CCard className="border-0 shadow-sm rounded-4 h-100 position-relative card-hover">
        {/* Delete Icon - Top Right */}
        {(user === 'Admin' || user === 'SuperAdmin') && (
          <CButton
            color="link"
            size="sm"
            className="position-absolute top-0 end-0 m-2 p-1"
            onClick={OnDeleteTask}
          >
            <CIcon icon={cilTrash} className="text-danger" size="lg" />
          </CButton>
        )}

        <CCardBody className="d-flex flex-column h-100">
          {/* Task ID */}
          <div
            onClick={handleOpenTask}
            style={{ cursor: 'pointer' }}
            className="mb-3"
          >
            <small className="text-muted">Task ID</small>
            <h6 className="fw-bold text-primary text-break mb-1">{id}</h6>
          </div>

          {/* Title */}
          <CTooltip content={taskName} placement="top">
            <CCardTitle className="text-dark text-capitalize fw-semibold mb-3 fs-6">
              {taskName}
            </CCardTitle>
          </CTooltip>

          {/* Status & Priority */}
          <div className="d-flex flex-row gap-5 mb-3">
            <div>
              <small className="text-muted d-block">Status</small>
              <CBadge color={color} className="rounded-pill px-3 py-1 text-capitalize fw-medium">
                {status}
              </CBadge>
            </div>
            <div>
              <small className="text-muted d-block">Severity</small>
              <CBadge color={getPriorityColor(priority)} className="rounded-pill px-3 py-1 text-capitalize fw-medium">
                {priority}
              </CBadge>
            </div>
          </div>

          {/* Dates & Info Grid */}
          <div className="row row-cols-1 row-cols-md-2 g-2 mb-2">
            <div className="col">
              <small className="text-muted d-block">Assigned To</small>
              <span className="fw-medium text-dark">{assignto?.toUpperCase()}</span>
            </div>
            <div className="col">
              <small className="text-muted d-block">Created By</small>
              <span className="fw-medium text-dark">{createdBy}</span>
            </div>
            <div className="col">
              <small className="text-muted d-block">Created On</small>
              <span className="fw-medium text-dark">{assignedDate}</span>
            </div>
            <div className="col">
              <small className="text-muted d-block">Target Date</small>
              <span className="fw-medium text-dark">{completionDate}</span>
            </div>
          </div>
        </CCardBody>
      </CCard>

      {/* <style jsx>{`
        .card-hover:hover {
          transform: scale(1.01);
          transition: 0.3s ease-in-out;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.075);
        }
      `}</style> */}
    </>
  )
}

export default TaskCard
