import axios from 'axios'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import Loader from '../../ui/Loader'
import { toast ,ToastContainer} from 'react-toastify'
import { UserFormValidate } from './formValidation'
import ApiUrl from '../../services/apiheaders'
import 'react-toastify/dist/ReactToastify.css';


const AddUserForm = ({ isUserAdded, closePopup, formName, EditUserData }) => {
  const [Userslist, setUserslist] = useState([])
  const [Designation, setDesignation] = useState([])
  const [Team, setTeam] = useState([])
  const [isLoading, setisLoading] = useState(true)

  const fetchUser = async () => {
    const response = await axios.get(`${ApiUrl.User}/userlist`)
    const response2 = await axios.get(`${ApiUrl.Team}/designation`)
    const response3 = await axios.get(`${ApiUrl.Team}`)
    setUserslist(response?.data?.data)
    setDesignation(response2?.data?.data)
    setTeam(response3?.data?.data)
    setisLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
     />
    
    <Formik
      initialValues={{
        name: EditUserData ? EditUserData.username : '',
        email: EditUserData ? EditUserData.email : '',
        mobile: EditUserData ? EditUserData.mobile : '',
        designation: EditUserData ? EditUserData.designationId : '',
        department: EditUserData ? EditUserData.departmentId : '',
        reportingto: EditUserData ? EditUserData.reportingToId : '',
        password: '',
        confirmpassword: '',
        // addedby: EditUserData ? EditUserData.addedby : '' ,
        // relatedTo: EditUserData ? EditUserData.relatedTo : '',
        // assignedTo: EditUserData ? EditUserData.assignedTo : '',
      }}
      validate={(values) => UserFormValidate(values, EditUserData)}
      onSubmit={async (values) => {
        try {
          setisLoading(true)
          let currentUser = JSON.parse(localStorage.getItem('user'))
          let addedbyuser = currentUser[0]?.userId || currentUser[0]?._id || currentUser[0]?.id
          let finalValue = {
            confirmpassword: values.confirmpassword,
            ...values,
            addedby: addedbyuser,
            relatedUser: addedbyuser,
          }
          let Response

          if (!EditUserData) {
            Response = await axios.post(`${ApiUrl.User}`, finalValue)
          } else {
            Response = await axios.put(`${ApiUrl.User}?userId=${EditUserData?.userId}`, finalValue)
          }

          if (Response.data.statusCode === 200) {
            
            toast.success(Response.data.message)
            closePopup()
            isUserAdded()
          } else if (Response.data.statusCode === 409) {
            toast.warn(Response.data.message)
          }
        } catch {
          toast.error('Something went wrong.')
        } finally {
          setisLoading(false)
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <>
          {isLoading && <Loader />}
          <div
            className="bg-white rounded mx-auto p-4"
            style={{
              maxWidth: '550px',
              maxHeight: '90vh', // max height relative to viewport
              overflowY: 'auto', // enable vertical scroll inside
              color: 'black',
              backdropFilter: 'blur(5px)',
            }}
          >
            <h4 className="mb-4 text-center">{formName}</h4>
            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                {errors.name && touched.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email & Mobile */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  <label htmlFor="mobile" className="form-label">
                    Contact <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    className={`form-control ${errors.mobile && touched.mobile ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mobile}
                  />
                  {errors.mobile && touched.mobile && (
                    <div className="invalid-feedback">{errors.mobile}</div>
                  )}
                </div>
              </div>

              {/* Password and Confirm Password - only if Adding new user */}
              {!EditUserData && (
                <div className="row g-3 mb-3">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    {errors.password && touched.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <label htmlFor="confirmpassword" className="form-label">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmpassword"
                      id="confirmpassword"
                      className={`form-control ${errors.confirmpassword && touched.confirmpassword ? 'is-invalid' : ''}`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmpassword}
                    />
                    {errors.confirmpassword && touched.confirmpassword && (
                      <div className="invalid-feedback">{errors.confirmpassword}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Designation & Department */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label htmlFor="designation" className="form-label">
                    Designation <span className="text-danger">*</span>
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    className={`form-select ${errors.designation && touched.designation ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.designation}
                  >
                    <option value="">Select Designation</option>
                    {Designation.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.designation && touched.designation && (
                    <div className="invalid-feedback">{errors.designation}</div>
                  )}
                </div>
                <div className="col-12 col-sm-6">
                  <label htmlFor="department" className="form-label">
                    Department <span className="text-danger">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    className={`form-select ${errors.department && touched.department ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.department}
                  >
                    <option value="">Select Department</option>
                    {Team.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.department && touched.department && (
                    <div className="invalid-feedback">{errors.department}</div>
                  )}
                </div>
              </div>

              {/* Reporting To */}
              <div className="mb-3">
                <label htmlFor="reportingto" className="form-label">
                  Reporting To <span className="text-danger">*</span>
                </label>
                <select
                  id="reportingto"
                  name="reportingto"
                  className={`form-select ${errors.reportingto && touched.reportingto ? 'is-invalid' : ''}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.reportingto}
                >
                  <option value="">Please Select</option>
                  {Userslist.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
                {errors.reportingto && touched.reportingto && (
                  <div className="invalid-feedback">{errors.reportingto}</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary btn-lg">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </Formik>
    </>
  )
}

export default AddUserForm
