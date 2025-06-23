import React, { useCallback, useState } from 'react'
import { CCard, CCardBody, CCardTitle, CAvatar, CBadge, CTooltip } from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../Loader'
import ApiUrl from '../../services/apiheaders'

const DashboardTaskCard = ({
  color,
  OriginalId,
  taskName,
  assignedDate,
  completionDate,
  status,
  id,
  assignto,
  taskId,
  OnDeleteTask,
  OnEditTask,
  createdBy,
}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const FirstTimeOpenfun = useCallback(async () => {
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

  return (
    <>
      {isLoading && <Loader />}
      <CCard
        className="shadow-sm border-0 mb-3 card-animate"
        style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '14px' }}
      >
        <div className="d-flex justify-content-between align-items-center px-3 pt-3">
          <Link className="text-decoration-none" onClick={FirstTimeOpenfun}>
            <span className="text-primary fw-semibold" style={{ fontSize: '13px' }}>
              Task ID: {id}
            </span>
          </Link>
          <CBadge color={color} className="px-3 py-1 text-capitalize">
            {status}
          </CBadge>
        </div>

        <CCardBody className="pt-2 pb-3 px-3">
          <CCardTitle className="mb-3 fw-semibold text-dark " style={{ fontSize: '14px' }}>
            <small className="text-muted "> Title: </small>
           <span className="ms-1">{taskName.toUpperCase()}</span>
          </CCardTitle>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <small className="text-muted d-block">Assigned To:</small>
              <div className="fw-semibold text-truncate text-dark">{assignto}</div>
            </div>

            <div className="col-12 col-md-6">
              <small className="text-muted d-block">Target Date:</small>
              <div className="fw-semibold text-truncate text-dark">{completionDate}</div>
            </div>
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default DashboardTaskCard
