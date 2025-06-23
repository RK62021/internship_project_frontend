import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { EmailValidation, isValidPassword } from '../../../utils/validations'
import ApiUrl from '../../../services/apiheaders'

const SignupPageBootstrap = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmpassword: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { fullName, email, password, confirmpassword } = formData

    if (!fullName || !email || !password || !confirmpassword) {
      toast.error('Please fill all the fields')
      setLoading(false)
      return
    }

    if (!EmailValidation(email)) {
      toast.error('Please enter a valid email')
      setLoading(false)
      return
    }

    if (!isValidPassword(password)) {
      toast.warn('Please enter a valid password')
      setLoading(false)
      return
    }

    if (password !== confirmpassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { confirmpassword, ...dataToSend } = formData
      const response = await axios.post(ApiUrl.Register, dataToSend)
      if (response.data.statusCode === 200) {
        toast.success(response.data.messege)
        setTimeout(() => {
          navigate('/')
        }, 1000)
      } else {
        toast.warn(response.data.messege || 'Registration failed')
      }
    } catch (error) {
      toast.error('Something went wrong, please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <ToastContainer />
      <div className="w-100" style={{ maxWidth: '450px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src="https://static.wixstatic.com/media/63c3c7_70b1690eb37b4d5e96fcdfbab6985fc6~mv2.png/v1/fill/w_344,h_116,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/LOGO-1.png"
            alt="Logo"
            style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-dark">DigiTracker</h2>
          <p className="text-dark">Team management and task tracking made simple</p>
        </div>

        {/* Card */}
        <div
          className="container bg-white p-4 shadow-sm"
          style={{ maxWidth: '450px',borderRadius: '1rem' }}
        >
          <h4 className="mb-3 text-black text-center">Sign Up</h4>
          <p className="text-dark text-center mb-4">Create a new account</p>

          <form onSubmit={submitForm}>
            {/* Full Name */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label text-dark">
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-dark border-end-0 rounded-start-4 px-3">
                  <i className="bi bi-person fs-5"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 rounded-end-4"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  style={{ backgroundColor: 'white', color: '#212529' }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-dark">
                Email address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-dark border-end-0 rounded-start-4 px-3">
                  <i className="bi bi-envelope fs-5"></i>
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 rounded-end-4"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  style={{ backgroundColor: 'white', color: '#212529' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-dark">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-dark border-end-0 rounded-start-4 px-3">
                  <i className="bi bi-lock fs-5"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 rounded-end-4"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  style={{ backgroundColor: 'white', color: '#212529' }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="confirmpassword" className="form-label text-dark">
                Confirm Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-dark border-end-0 rounded-start-4 px-3">
                  <i className="bi bi-lock fs-5"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 rounded-end-4"
                  id="confirmpassword"
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
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
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>

            <div className="text-center">
              <p className="mb-0 text-dark">
                Already have an account?{' '}
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => navigate('/')}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupPageBootstrap
