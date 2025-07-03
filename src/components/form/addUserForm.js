import axios from 'axios';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import Loader from '../../ui/Loader';
import { toast, ToastContainer } from 'react-toastify';
import { UserFormValidate } from './formValidation';
import ApiUrl from '../../services/apiheaders';
import 'react-toastify/dist/ReactToastify.css';

const AddUserForm = ({ isUserAdded, closePopup, formName, EditUserData }) => {
  const [Userslist, setUserslist] = useState([]);
  const [Designation, setDesignation] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const [userRes, desigRes] = await Promise.all([
        axios.get(`${ApiUrl.User}/userlist`),
        axios.get(`${ApiUrl.Team}/designation`),
      ]);

      setUserslist(userRes?.data?.data || []);
      setDesignation(desigRes?.data?.data || []);
    } catch (err) {
      toast.error('Error fetching form data');
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Formik
        initialValues={{
          name: EditUserData ? EditUserData.username : '',
          email: EditUserData ? EditUserData.email : '',
          mobile: EditUserData ? EditUserData.mobile : '',
          designation: EditUserData ? EditUserData.designationId : '',
          reportingto: EditUserData ? EditUserData.reportingToId : '',
          password: '',
          confirmpassword: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) errors.name = 'Name is required';
          if (!values.email) errors.email = 'Email is required';
          if (!values.mobile) errors.mobile = 'Mobile is required';
          if (!values.designation) errors.designation = 'Designation is required';
          if (!values.reportingto) errors.reportingto = 'Reporting To is required';

          if (!EditUserData) {
            if (!values.password) errors.password = 'Password is required';
            if (!values.confirmpassword) errors.confirmpassword = 'Confirm password is required';
            if (values.password !== values.confirmpassword) errors.confirmpassword = 'Passwords do not match';
          }

          return errors;
        }}
        onSubmit={async (values) => {
          try {
            setisLoading(true);
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const addedbyuser =
              currentUser[0]?.userId || currentUser[0]?._id || currentUser[0]?.id;

            const finalValue = {
              ...values,
              addedby: addedbyuser,
              relatedUser: addedbyuser,
            };

            const response = !EditUserData
              ? await axios.post(`${ApiUrl.User}`, finalValue)
              : await axios.put(`${ApiUrl.User}?userId=${EditUserData?.userId}`, finalValue);

            if (response.data.statusCode === 200) {
              toast.success(response.data.message);
              closePopup();
              isUserAdded();
            } else if (response.data.statusCode === 409) {
              toast.warn(response.data.message);
            }
          } catch (err) {
            toast.error('Something went wrong.');
          } finally {
            setisLoading(false);
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
                maxHeight: '90vh',
                overflowY: 'auto',
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

                {/* Password and Confirm Password */}
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

                {/* Designation */}
                <div className="mb-3">
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
                    {Designation.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.designation && touched.designation && (
                    <div className="invalid-feedback">{errors.designation}</div>
                  )}
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

                {/* Submit */}
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
  );
};

export default AddUserForm;
