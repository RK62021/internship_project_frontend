import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Avatar1 from '../../assets/images/avatars/1.jpg'
import { UTC_TO_IND_FORMAT } from '../../utils/dateConvert'
import SlideDownPopup from '../../layout/PopupLayout.js/sliderPopup'
import { AnimatePresence } from 'framer-motion'
import ApiUrl from '../../services/apiheaders'
import PopupLayout from '../../layout/PopupLayout.js'
import 'react-toastify/dist/ReactToastify.css'

const UserCard = ({ ccolor, fcolor, isActive, data, render, onEdit }) => {
  const [isDelete, setIsDelete] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [assignOptions, setAssignOptions] = useState([])
  const [toggling, setToggling] = useState(false)

  const userType = useSelector((state) => state.userType)
  const user_id = useSelector((state) => state.userId)

  const fetchAssignOptions = async () => {
    try {
      const response = await axios.get(`${ApiUrl.User}/userlist`)
      if (response.data.statusCode === 200) {
        const users = response.data.data.filter((u) => !u.isDeleted)
        setAssignOptions(users)
      } else {
        toast.error('Failed to fetch user list for assignment.')
      }
    } catch {
      toast.error('Error fetching user list for assignment.')
    }
  }

  useEffect(() => {
    fetchAssignOptions()
  }, [])

  const handleConfirmDelete = async (id, user_id) => {
    try {
      const response = await axios.delete(`${ApiUrl.User}?id=${id}&user_id=${user_id}`)
      if (response.data.statusCode === 200) {
        toast.warn(response.data.message)
        render()
      }
    } catch {
      toast.error('Something went wrong.')
    }
  }

  const handleAssignConfirm = async () => {
    if (!selectedUser) {
      toast.warn('Please select a user before assigning.')
      return
    }

    try {
      const response = await axios.post(`${ApiUrl.User}/assignto`, {
        userthatassigned: selectedUser,
        usertowhichassigned: data.userId,
      })

      if (response?.data?.statusCode === 200) {
        toast.success('User assigned successfully.')
        render()
      } else {
        toast.error(response?.data?.message || 'Failed to assign user.')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error assigning user.')
    } finally {
      setShowAssignModal(false)
    }
  }

  const handleToggleActive = async () => {
    if (toggling) return
    setToggling(true)
    try {
      const response = await axios.patch(`${ApiUrl.User}/status`, {
        userId: data.userId,
        isActive: !isActive,
      })
      if (response.data.success) {
        toast.success(response.data.message || 'Status updated')
        render()
      } else {
        toast.error('Failed to update status')
      }
    } catch {
      toast.error('Server error while updating status')
    } finally {
      setToggling(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isDelete && (
          <SlideDownPopup
            onClose={() => setIsDelete(false)}
            onConfirm={() => handleConfirmDelete(data.userId, user_id)}
          />
        )}
      </AnimatePresence>

      <ToastContainer />

      <div
        className="card shadow-lg rounded-4 border-0 h-100 overflow-hidden"
        style={{ background: 'linear-gradient(to right, #f8f9fa, #e9ecef)' }}
      >
        <div
          className="d-flex flex-wrap justify-content-between align-items-center px-4 py-3 gap-2"
          style={{ backgroundColor: ccolor, color: 'white' }}
        >
          {(userType === 'Admin' || userType === 'SuperAdmin') ? (
            <div className="form-check form-switch d-flex align-items-center gap-2">
              <input
                className={`form-check-input ${isActive ? 'bg-success border-success' : ''}`}
                type="checkbox"
                role="switch"
                id={`toggle-${data.userId}`}
                checked={isActive}
                onChange={handleToggleActive}
                disabled={toggling}
              />
              <label className="form-check-label" htmlFor={`toggle-${data.userId}`}>
                {isActive ? 'Active' : 'Inactive'}
              </label>
            </div>
          ) : (
            <span className="fw-medium small">{isActive ? 'Active' : 'Inactive'}</span>
          )}

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {(userType === 'SuperAdmin' || userType === 'Admin') && (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-light"
                  onClick={() => setShowAssignModal(true)}
                >
                  Assign To
                </button>
                <FaEdit
                  title="Edit"
                  color="black"
                  size={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onEdit(data)}
                />
                <FaTrash
                  title="Delete"
                  color="black"
                  size={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsDelete(true)}
                />
              </>
            )}
          </div>
        </div>

        <div className="card-body py-3 px-4" style={{ fontSize: '13px' }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <h5 className="card-title mb-0 text-primary">{data.username}</h5>
            <img
              src={Avatar1}
              alt="Avatar"
              className="rounded-circle mt-2 mt-md-0"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          </div>

          <div className="mb-3">
            {[
              ['Email:', <a href={`mailto:${data.email}`} className="text-primary text-decoration-none">{data.email || 'N/A'}</a>],
              ['Mobile:', data.mobile || 'N/A'],
              ['Designation:', data.designation || 'N/A'],
              ['Department:', data.department || 'N/A'],
              ['Reporting To:', data.reportingTo?.toUpperCase() || 'N/A'],
              ['Assigned To:', data.assignedTo?.toUpperCase() || 'N/A']
            ].map(([label, value], i) => (
              <div key={i} className="d-flex flex-column flex-md-row justify-content-between mb-2 text-break">
                <strong>{label}</strong>
                <span className="text-dark">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="card-footer text-center"
          style={{
            backgroundColor: fcolor,
            borderTop: '1px solid #ccc',
            fontSize: '14px',
          }}
        >
          <small className="fw-semibold text-dark">
            Added On : {UTC_TO_IND_FORMAT(data.addeddate)}
          </small>
        </div>
      </div>

      {showAssignModal && (
        <PopupLayout
          show={showAssignModal}
          onClose={() => setShowAssignModal(false)}
        >
          <div
            className="rounded w-100"
            style={{
              backgroundColor: '#fff',
              maxWidth: '550px',
              width: '90%',
              color: 'black',
              padding: '16px',
            }}
          >
            <h5 className="text-center mb-3">Assign To</h5>

            <div className="mb-3">
              <label htmlFor="assignUser" className="form-label">
                Select User <span className="text-danger">*</span>
              </label>
              <select
                id="assignUser"
                className="form-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select a user</option>
                {assignOptions.map((user, i) => (
                  <option key={i} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary w-100 w-sm-auto"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary w-100 w-sm-auto"
                onClick={handleAssignConfirm}
              >
                Assign
              </button>
            </div>
          </div>
        </PopupLayout>
      )}
    </>
  )
}

export default UserCard
