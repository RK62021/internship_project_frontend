import React, { useCallback, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CBadge,
  CTooltip,
  CButton,
} from '@coreui/react'
import './cardStyles/style.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../Loader'
import ApiUrl from '../../services/apiheaders'
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useSelector } from 'react-redux'

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
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.userType)

  const FirstTimeOpenfun = useCallback(async () => {
    setIsLoading(true)
    try {
      const Response = await axios.get(
        `${ApiUrl.User}/task/firsttimeopen?taskId=${OriginalId}`
      )
      if (Response.data.statusCode === 200) {
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

  return (
    <>
      {isLoading && <Loader />}

      <CCard className="shadow-sm border-1 rounded-4 mb-4 card-animate bg-white h-100 d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center px-4 pt-4 flex-wrap gap-2">
          <Link
            className="text-decoration-none"
            onClick={FirstTimeOpenfun}
            style={{ cursor: 'pointer' }}
          >
            <h6 className="mb-0 text-primary fw-semibold text-break">
              Task ID: {id}
            </h6>
          </Link>
          <CBadge color={color} className="px-3 py-1 text-capitalize rounded-pill shadow-sm">
            {status}
          </CBadge>
        </div>

        {/* Body */}
        <CCardBody className="pt-3 pb-4 px-4 d-flex flex-column flex-grow-1">
          {/* Title */}
          <div className="mb-3">
            <CTooltip content={taskName} placement="top">
              <CCardTitle className="h5 fw-bold text-dark text-truncate text-capitalize">
                {taskName}
              </CCardTitle>
            </CTooltip>
          </div>

          {/* Details Grid */}
          <div className="row row-cols-1 row-cols-md-2 g-3 mb-3">
            <div className="col">
              <div className="mb-2">
                <small className="text-muted d-block">Assigned To</small>
                <CBadge color="info" className="px-2 py-1 fs-6 text-white">
                  {assignto.toUpperCase()}
                </CBadge>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">Created Date</small>
                <span className="fw-medium text-dark">{assignedDate}</span>
              </div>
            </div>

            <div className="col">
              <div className="mb-2">
                <small className="text-muted d-block">Created By</small>
                <span className="fw-medium text-dark">{createdBy}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">Target Date</small>
                <span className="fw-medium text-dark">{completionDate}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          {user === 'Admin' || user === 'SuperAdmin' ? (
            <div className="mt-auto d-flex justify-content-md-end justify-content-start">
              <CTooltip content="Delete Task" placement="top">
                <CButton
                  color="danger"
                  size="sm"
                  variant="outline"
                  onClick={OnDeleteTask}
                >
                  <CIcon icon={cilTrash} className="me-2" /> Delete
                </CButton>
              </CTooltip>
            </div>
          ) : null}
        </CCardBody>
      </CCard>
    </>
  )
}

export default TaskCard
