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
        {/* Header: Task ID & Info */}
        <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
          <div className="text-primary fw-semibold medium mb-1">
            <i className="bi bi-hash me-1"></i>Task ID: {id}
          </div>
        </div>


        {/* Title */}
        <div className="mb-2">
          <div className="fw-semibold text-dark fs-7">
            <span className="text-muted small">Title:</span>{' '}
            <span className="ms-1">{taskName?.toUpperCase() || 'N/A'}</span>
          </div>
        </div>
        {/* Status and Priority Side by Side */}
        <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
          <div className="text-capitalize fw-semibold">
            <span className="text-muted me-1">Status:</span>
            <span className={`text-${color}`}>{status || 'N/A'}</span>
          </div>
          <div className="text-capitalize fw-semibold">
            <span className="text-muted me-1">Severity:</span>
            <span className={`text-${getPriorityColor(priority)}`}>{priority || 'N/A'}</span>
          </div>
        </div>

        {/* Assigned & Date */}
        <div className="row">
          <div className="col-12 col-sm-6 mb-2">
            <small className="text-muted">Assigned To</small>
            <div className="fw-medium text-dark text-truncate">{assignto || 'N/A'}</div>
          </div>
          <div className="col-12 col-sm-6 mb-2">
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
