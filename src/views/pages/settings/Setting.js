import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ApiUrl from '../../../services/apiheaders'
import { EmailValidation } from '../../../utils/validations'
import useIsMobile from '../../../hooks/useMobile.js'
import { GetLocalStorage } from '../../../services/localStorageService.js'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../../services/Logoutservice.js'

const Settings = () => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userType = useSelector((state) => state.userType)

  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    mobile: '',
  })

  const [isEditable, setIsEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newDesignation, setNewDesignation] = useState('')
  const [userEmailToUpdate, setUserEmailToUpdate] = useState('')
  const [newRole, setNewRole] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = GetLocalStorage('user')[0]?.userId
        const response = await axios.get(`${ApiUrl.getProfile}?userId=${userId}`)
        if (response.data.statusCode === 200) {
          const { fullName, email, mobile } = response.data.data
          setRegistrationData({ fullName, email, mobile })
        } else {
          toast.error('Unable to fetch user details')
        }
      } catch (error) {
        toast.error('Failed to fetch user data')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setRegistrationData((prev) => ({ ...prev, [name]: value }))
  }

  const EditProfile = async (e) => {
    e.preventDefault()
    const { fullName, email, mobile } = registrationData

    if (!fullName || !email || !mobile) {
      toast.error('Please fill all fields')
      return
    }

    if (!EmailValidation(email)) {
      toast.error('Invalid email format')
      return
    }

    try {
      const userId = GetLocalStorage('user')[0]?.userId
      const response = await axios.post(`${ApiUrl.updateProfile}`, {
        fullName,
        email,
        mobile,
        updatedBy: userId,
      })

      if (response.data.statusCode === 200) {
        toast.success('Profile updated successfully')
        setIsEditable(false)
      } else {
        toast.warn(response.data.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleAddDesignation = async () => {
    if (!newDesignation.trim()) {
      toast.error('Please enter a designation name')
      return
    }

    try {
      const userId = GetLocalStorage('user')[0]?.userId
      const response = await axios.post(`${ApiUrl.Team}/designation`, {
        name: newDesignation,
        createdBy: userId,
      })

      if (response.data.statusCode === 200) {
        toast.success('Designation created successfully')
        setNewDesignation('')
      } else {
        toast.warn(response.data.message || 'Error creating designation')
      }
    } catch (err) {
      toast.error('Error creating designation')
      console.error(err)
    }
  }

  const handleRoleChangeSubmit = async () => {
    if (!userEmailToUpdate.trim() || !newRole.trim()) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const userId = GetLocalStorage('user')[0]?.userId
      const response = await axios.post(`${ApiUrl.changeRole}`, {
        userEmail: userEmailToUpdate,
        roleName: newRole,
        updatedBy: userId,
      })

      if (response.data.statusCode === 200) {
        toast.success('Role updated successfully')
        setUserEmailToUpdate('')
        setNewRole('')
      } else {
        toast.warn(response.data.message || 'Role update failed')
      }
    } catch (err) {
      toast.error('Error updating role')
      console.error(err)
    }
  }

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm">
            <h3>Profile Settings</h3>
            <p className={isMobile ? 'small' : ''}>View or update your profile</p>

            {isLoading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              <>
                {!isEditable ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={registrationData.fullName}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={registrationData.email}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        name="mobile"
                        value={registrationData.mobile}
                        disabled
                      />
                    </div>
                    <button
                      className="btn btn-secondary w-100"
                      onClick={() => setIsEditable(true)}
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <form onSubmit={EditProfile}>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={registrationData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={registrationData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        name="mobile"
                        value={registrationData.mobile}
                        onChange={handleChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Update
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm mb-4">
            <h3>Notification Settings</h3>
            <p>Manage how you receive notifications</p>
            <div className="form-check form-switch d-flex justify-content-between align-items-center mb-3">
              <label className="form-check-label">Email Notifications</label>
              <input className="form-check-input" type="checkbox" defaultChecked />
            </div>
            <div className="form-check form-switch d-flex justify-content-between align-items-center">
              <label className="form-check-label">Push Notifications</label>
              <input className="form-check-input" type="checkbox" defaultChecked />
            </div>
          </div>

          <div className="card p-4 shadow-sm">
            <h3>Account Security</h3>
            <p>Manage your account security settings</p>
            <button className="btn btn-outline-primary w-100 mb-3">Change Password</button>
            <button
              className="btn btn-danger w-100"
              onClick={() => logout({ dispatch, navigate, toast })}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {userType === 'SuperAdmin' && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card p-4 shadow-sm">
              <h3>Manage Designations & Roles</h3>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h5>Add New Designation</h5>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="New designation title"
                      value={newDesignation}
                      onChange={(e) => setNewDesignation(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={handleAddDesignation}>
                      Add
                    </button>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <h5>Change User Role</h5>
                  <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="User email"
                    value={userEmailToUpdate}
                    onChange={(e) => setUserEmailToUpdate(e.target.value)}
                  />
                  <select
                    className="form-select mb-2"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="">Select role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                  <button className="btn btn-primary w-100" onClick={handleRoleChangeSubmit}>
                    Update Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
