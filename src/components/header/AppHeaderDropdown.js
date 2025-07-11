import React, { useEffect, useState } from 'react'
import {
  CButton,
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilBell, cilEnvelopeOpen, cilLockLocked } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PopupLayout from '../../layout/PopupLayout.js'
import '../../layout/style.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loader from '../../ui/Loader/index.js'
import ApiUrl from '../../services/apiheaders.js'
import { logout } from '../../services/Logoutservice.js'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const UserId = useSelector((state) => state.userId)
  const UserName = useSelector((state) => state.userName)

  const [isChangePassword, setIsChangePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [notifications, setNotifications] = useState([])
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // 🔁 Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${ApiUrl.User}/notifications?userId=${UserId}`)
      if (res.data.success) setNotifications(res.data.notifications)
    } catch (err) {
      toast.error('Failed to load notifications')
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [UserId])

  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await axios.post(`${ApiUrl.User}/notifications/mark-as-read`, { notificationId })
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true, readDate: new Date() } : n,
          ),
        )
      }
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await axios.post(`${ApiUrl.User}/notifications/mark-all-as-read`, {
        userId: UserId,
      })
      if (res.data.success) {
        toast.success('All marked as read')
        fetchNotifications()
      }
    } catch {
      toast.error('Failed to mark all as read')
    }
  }

  const handleClearNotifications = () => {
    setNotifications([])
    toast.info('Cleared locally')
  }

  const handleLogout = () => logout({ dispatch, navigate, toast })

  const handleSubmitForm = async () => {
    setIsLoading(true)
    if (!password || !confirmPassword) {
      setError('All fields are required.')
      setIsLoading(false)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    try {
      const res = await axios.put(`${ApiUrl.User}/change-password`, { userId: UserId, password })
      if (res.data.success || res.data.statusCode === 200) {
        toast.success('Password Updated')
        setTimeout(() => logout({ dispatch, navigate, toast }), 500)
      } else {
        toast.error('Failed to update password')
      }
    } catch {
      toast.error('Error updating password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loader />}

      {/* 🔐 Password Popup */}
      {isChangePassword && (
        <PopupLayout show={isChangePassword} onClose={() => setIsChangePassword(false)}>
          <div className="changepassword-body p-3" style={{ maxWidth: '90vw', margin: 'auto' }}>
            <form>
              <div className="mb-3">
                <label className="changepassword-label">New Password</label>
                <input
                  type="password"
                  className="form-control task-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="changepassword-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control task-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error && <div className="text-danger mt-1">{error}</div>}
              </div>
              <button
                type="button"
                className="changepassword-button w-100 mt-3"
                onClick={handleSubmitForm}
              >
                Change Password
              </button>
            </form>
          </div>
        </PopupLayout>
      )}

      {/* 🔔 Notification Dropdown */}
      <CDropdown
        className="me-3"
        variant="nav-item"
        onShow={() => setShowNotificationDropdown(true)}
        onHide={() => setShowNotificationDropdown(false)}
      >
        <CDropdownToggle className="nav-link py-0" caret={false}>
          <CIcon icon={cilBell} size="lg" />
          {unreadCount > 0 && (
            <CBadge
              color="danger"
              shape="rounded-pill"
              className="position-absolute top-0 start-100 translate-middle"
            >
              {unreadCount}
            </CBadge>
          )}
        </CDropdownToggle>
        <CDropdownMenu
          className="pt-0 dropdown-menu-end"
          placement="bottom-end"
          style={{ minWidth: '300px', maxHeight: '300px', overflowY: 'auto' }}
        >
          <CDropdownHeader className="bg-body-secondary fw-semibold py-2 px-3">
            🔔 Notifications ({notifications.length})
          </CDropdownHeader>
          {notifications.length === 0 ? (
            <div className="text-center text-muted py-3">No new notifications</div>
          ) : (
            notifications.map((note) => (
              <CDropdownItem
                key={note._id}
                className={`text-wrap small py-2 ${note.isRead ? 'text-muted' : 'text-dark fw-semibold'}`}
                onClick={() => handleMarkAsRead(note._id)}
                style={{ cursor: 'pointer' }}
              >
                <div>{note.message}</div>
                <div className="text-muted small">{new Date(note.createdAt).toLocaleString()}</div>
              </CDropdownItem>
            ))
          )}
          <CDropdownDivider />
          <div className="d-grid gap-2 px-3 pb-2">
            <CButton
              color="success"
              variant="outline"
              className="fw-semibold"
              size="sm"
              onClick={markAllAsRead}
            >
              ✅ Mark All As Read
            </CButton>

            <CButton
              color="danger"
              variant="outline"
              className="fw-semibold"
              size="sm"
              onClick={handleClearNotifications}
            >
              🗑️ Clear Local
            </CButton>
          </div>
        </CDropdownMenu>
      </CDropdown>

      {/* 👤 User Menu */}
      <CDropdown variant="nav-item">
        <CDropdownToggle
          className="py-0 pe-0 d-flex flex-row gap-2 align-items-center"
          caret={false}
        >
          <CAvatar src="https://i.pravatar.cc/150?img=2" size="sm" />
          <div style={{ marginTop: '2px' }}>
            <strong className="fw-semibold">{UserName}</strong>
          </div>
        </CDropdownToggle>

        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem onClick={() => navigate('/settings')}>
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem onClick={() => setIsChangePassword(true)}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Change Password
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            LogOut
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown
