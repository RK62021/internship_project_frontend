import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import ApiUrl from '../../../services/apiheaders'
import axios from 'axios'
import { SetLocalStorage } from '../../../services/localStorageService'
import { useDispatch } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import { EmailValidation } from '../../../utils/validations'
import Loader from '../../../ui/Loader'

const Login = () => {
    const dispatch = useDispatch()
  const navigate = useNavigate()
  const [LoginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [Loading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }
  const submitLogin = async () => {
    setIsLoading(true)
    const matchEmail = EmailValidation(LoginData.email)
    if (!LoginData.email || !LoginData.password) {
      setIsLoading(false)
      toast.error('Please fill Username and Password')
      return
    }
    if (!matchEmail) {
      setIsLoading(false)
      toast.error('Please enter valid email')
      return
    }

    try {
      const response = await axios.post(ApiUrl.Login, LoginData)
      console.log('response data--------', response)
      if (response.data.statusCode === 200) {
        dispatch({
          type: 'set',
          userType: response.data.data.user[0].userType,
          userName: response.data.data.user[0].username,
          userId: response.data.data.user[0].userId,
        })
        SetLocalStorage('token', response.data.data.token)
        SetLocalStorage('isLogin', true)
        SetLocalStorage('user', JSON.stringify(response.data.data.user))
        setIsLoading(false)
        // toast.success('Login successful!')
        setTimeout(() => {
          navigate('/dashboard', { state: { isLogin: true } });
        }, 500)
      } else if (response.data.statusCode === 404) {
        setIsLoading(false)
        toast.error('Invalid credentials')
      }
    } catch (err) {
      setIsLoading(false)
      toast.error('Something went wrong, please try again.')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      {Loading && <Loader/>}
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="email"
                        type="email"
                        placeholder="Email"
                        // autoComplete="email"
                        onChange={(e) => handleChange(e)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(e) => handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="Password"
                        // autoComplete="password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6} onClick={() => submitLogin()}>
                        <CButton color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
