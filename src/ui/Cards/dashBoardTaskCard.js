import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../Loader'
import ApiUrl from '../../services/apiheaders'

const DashboardTaskCard = ({
  color,
  OriginalId,
  taskName,
  completionDate,
  status,
  id,
  assignto,
  priority,
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

      <div
        className="card shadow-sm border-0 mb-4 p-3 hover-shadow"
        style={{
          borderRadius: '16px',
          fontFamily: 'Segoe UI, sans-serif',
          fontSize: '14px',
          cursor: 'pointer',
          maxWidth: '360px',
          width: '100%',
          margin: '0 auto',
        }}
        onClick={FirstTimeOpenfun}
      >
        {/* Header: Task ID & Badges */}
        <div className="d-flex justify-content-between align-items-start flex-wrap">
          <div className="text-primary fw-semibold small mb-2">
            <i className="bi bi-hash me-1"></i>Task ID: {id}
          </div>
          <div className="d-flex flex-wrap gap-4">
            <span className={`badge bg-${color} text-capitalize fw-semibold`}>
              Status: {status}
            </span>
            <span className="badge bg-secondary text-capitalize fw-semibold">
              Severity: {priority}
            </span>
          </div>
        </div>

        {/* Body: Title */}
        <div className="mt-2">
          <div className="fw-semibold text-dark fs-7">
            <span className="text-muted small">Title:</span>{' '}
            <span className="ms-1">{taskName?.toUpperCase()}</span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="row mt-2">
          <div className="col-12 col-md-6 mb-2">
            <small className="text-muted">Assigned To</small>
            <div className="fw-medium text-dark text-truncate">{assignto || 'N/A'}</div>
          </div>
          <div className="col-12 col-md-6 mb-2">
            <small className="text-muted">Target Date</small>
            <div className="fw-medium text-dark text-truncate">{completionDate || 'N/A'}</div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-shadow {
          transition: all 0.3s ease-in-out;
        }
        .hover-shadow:hover {
          transform: scale(1.02);
          box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  )
}

export default DashboardTaskCard
