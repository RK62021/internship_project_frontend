import React, { useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { ClearLocalStorage } from '../../services/localStorageService'
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

  const [IsChangePassword, setIsChangePassword] = useState(false)
  const [Password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const [Error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // const logout = async () => {
  //   try {
  //     const token = localStorage.getItem('token')
  //     if (!token) {
  //       console.error('No token found in localStorage')
  //       toast.error('You are not logged in.')
  //       return
  //     }
  //     // Make sure to include the token in the request headers

  //     const logoutResponse = await axios.post(`${ApiUrl.Logout
  //     }`, {
  //       Token : token,
  //     })

  //     if (logoutResponse.data.statusCode !== 200) {
  //       console.error('Logout failed:', logoutResponse.data.message)
  //       toast.error('Logout failed. Please try again.')
  //       return
  //     }
  //     const data = ClearLocalStorage()
  //     dispatch({ type: 'set', userType: '', userName: '' })
  //     if (data == true) {
  //       navigate('/login')
  //     }
  //     console.log('Logout successful:', logoutResponse.data.message)
  //     toast.success('Logout successful')

  //   } catch (error) {
  //     console.error('Error during logout:', error)
  //     toast.error('Logout failed. Please try again.')
  //     return

  //   }
  // }

  const handleLogout = () => {
    logout({ dispatch, navigate, toast })
  }

  const handleSubmitForm = async () => {
    setIsLoading(true)
    if (!Password && !confirmPassword) {
      setError('Fields are required..')
      return
    }
    if (Password !== confirmPassword) {
      setError('Password not match..')
      return
    }
    const value = { userId: UserId, password: Password }
    console.log('object', value)
    const Response = await axios.put(`${ApiUrl.User}/change-password`, value)
    if (Response.data.statusCode === 200) {
      setIsLoading(false)
      toast.success('Password Updated')
      setTimeout(() => {
        logout()
      }, 500)
    }
  }
  return (
    <>
      {isLoading && <Loader />}
      {IsChangePassword && (
        <PopupLayout
          show={IsChangePassword}
          onClose={() => setIsChangePassword(false)}
          children={
            <>
              <div
                className="changepassword-body"
                style={{
                  maxWidth: '90vw',
                  margin: 'auto',
                  overflowX: 'hidden',
                  wordWrap: 'break-word',
                  padding: '20px',
                }}
              >
                <form className="space-y-4" style={{ overflowX: 'hidden' }}>
                  <div className="mb-3">
                    <label htmlFor="password" className="changepassword-label">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control task-input"
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === ' ') return
                        setPassword(value)
                      }}
                      value={Password}
                      style={{ maxWidth: '100%', overflowX: 'hidden' }}
                    />
                    {Error.length > 0 && <div className="text-danger">{Error}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="changepassword-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="form-control task-input"
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === ' ') return
                        setconfirmPassword(value)
                      }}
                      value={confirmPassword}
                      style={{ maxWidth: '100%', overflowX: 'hidden' }}
                    />
                  </div>
                  <div style={{ marginTop: '33px' }}>
                    <button
                      type="button"
                      onClick={() => handleSubmitForm()}
                      className="changepassword-button"
                      style={{ width: '100%' }}
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </>
          }
        />
      )}

      <CDropdown variant="nav-item">
        <CDropdownToggle
          placement="bottom-end"
          className="py-0 pe-0 d-flex flex-row gap-2 align-items-center"
          caret={false}
        >
          <CAvatar src="https://i.pravatar.cc/150?img=2" size="sm" />

          <div style={{ marginTop: '2px' }} className="text-center">
            <strong className="fw-semibold">{UserName}</strong>
          </div>
        </CDropdownToggle>

        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem
            href="#"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/settings')}
          >
            <CIcon icon={cilBell} className="me-2" />
            Profile
            <CBadge color="info" className="ms-2">
              {/* 42 */}
            </CBadge>
          </CDropdownItem>
          <CDropdownItem style={{ cursor: 'pointer' }} onClick={() => setIsChangePassword(true)}>
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Change Password
            <CBadge color="success" className="ms-2"></CBadge>
          </CDropdownItem>

          {/*                   
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}

          <CDropdownDivider />
          <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilLockLocked} className="me-2" />
            LogOut
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown
