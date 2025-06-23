

import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { EmailValidation } from '../../../utils/validations'
import ApiUrl from "../../../services/apiheaders"
import { SetLocalStorage } from "../../../services/localStorageService"

const LoginPageBootstrap = () => {
  const [LoginData, setLoginData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const submitLogin = async () => {
    setLoading(true)
    const matchEmail = EmailValidation(LoginData.email)
    if (!LoginData.email || !LoginData.password) {
      setLoading(false)
      toast.error('Please fill Username and Password')
      return
    }
    if (!matchEmail) {
      setLoading(false)
      toast.error('Please enter valid email')
      return
    }

    try {
      const response = await axios.post(ApiUrl.Login, LoginData)
      if (response.data.statusCode === 200) {
        const user = response.data.data.user[0]
        dispatch({
          type: 'set',
          userType: user.userType,
          userName: user.username,
          userId: user.userId,
        })
        SetLocalStorage('token', response.data.data.token)
        SetLocalStorage('isLogin', true)
        SetLocalStorage('user', JSON.stringify(response.data.data.user))
        SetLocalStorage("coreui-free-react-admin-template-theme","Light")
        setTimeout(() => {
          navigate('/dashboard', { state: { isLogin: true } })
        }, 500)
      } else {
        setLoading(false)
        toast.error('Invalid credentials')
      }
    } catch (err) {
      setLoading(false)
      toast.error('Something went wrong, please try again.')
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <ToastContainer />
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src="https://static.wixstatic.com/media/63c3c7_70b1690eb37b4d5e96fcdfbab6985fc6~mv2.png/v1/fill/w_344,h_116,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/LOGO-1.png"
            alt="Logo"
            style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-4 ">
          <h2 className="fw-bold text-dark">DigiTracker</h2>
          <p className=" text-dark">Team management and task tracking made simple</p>
        </div>

        {/* Card */}
                  <div
  className="container"
  style={{
    maxWidth: '500px',
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '1rem',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  }}
>
          <div className="card-body p-4">
            <h4 className="mb-3 text-black">Sign In</h4>
            <p className="text-dark mb-4">Sign in to your account</p>

            {/* Form */}
  
  <form>
    <div className="mb-3">
      <label htmlFor="email" className="form-label text-dark">Email address</label>
      <div className="input-group">
        <span className="input-group-text bg-light text-dark border-end-0 rounded-start-4 px-3">
  <i className="bi bi-person fs-5"></i>
</span>
        <input
          type="email"
          className="form-control border-start-0 rounded-end-4"
          id="email"
          name="email"
          onChange={handleChange}
          required
          style={{ backgroundColor: 'white', color: '#212529' }}
        />
      </div>
    </div>

    <div className="mb-4">
      <label htmlFor="password" className="form-label text-dark">Password</label>
      <div className="input-group">
        <span className="input-group-text bg-light text-dark border-end-0 rounded-start-4 px-3">
  <i className="bi bi-lock fs-5"></i>
</span>

        <input
          type="password"
          className="form-control border-start-0 rounded-end-4"
          id="password"
          name="password"
          onChange={handleChange}
          required
           style={{ backgroundColor: 'white', color: '#212529' }}
        />
      </div>
    </div>

    <div className="d-grid mb-3">
      <button
        type="submit"
        className="btn btn-primary rounded-3"
        disabled={loading}
        onClick={submitLogin}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </div>

    <div className="text-center">
      <p className="mb-0 text-dark">
        Don’t have an account?{' '}
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={() => navigate('/register')}
        >
          Sign Up
        </button>
      </p>
    </div>
  </form>
</div>

        </div>
      </div>
    </div>
  )
}

export default LoginPageBootstrap

