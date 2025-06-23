import axios from 'axios'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import './style.css'
import Loader from '../../ui/Loader'
import useIsAdminOrSuperAdmin from '../../hooks/checkUser'
import ApiUrl from '../../services/apiheaders'
import { TaskInputTimeAndDate } from '../../utils/dateConvert'
import { GetLocalStorage } from '../../services/localStorageService'

const formatDateToInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  const year = d.getFullYear()
  return [year, month, day].join('-')
}

const AddTaskForm = ({ isTaskAdded, closePopup, data, name, formName, userId }) => {
  const isAdminOrSuperAdmin = useIsAdminOrSuperAdmin()
  const isAddForm = name === 'addTask'
  const [Userslist, setUserslist] = useState([])
  const [isLoading, setisLoading] = useState(false)

  const fetchUser = async () => {
    try {
      const userId = GetLocalStorage('user')?.[0]?.userId;


      const response = await axios.get(`${ApiUrl.User}/userlistcustom/?userId=${userId}`)
      setUserslist(response?.data?.data || [])
      console.log('Users fetched successfully:', response.data.data)
      console.log(Userslist)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <Formik
      initialValues={{
        name: data ? data[0].name : '',
        description: data ? data[0].details : '',
        targetdate: data ? formatDateToInput(data[0].targetdate) : '',
        assignto: data ? data[0].assigntoId : '',
      }}
      validate={(values) => {
        const errors = {}
        if (!values.name) errors.name = 'Task name is required'
        if (!values.description) errors.description = 'Description is required'
        if (!values.assignto) errors.assignto = 'Assign To is required'
        if (!values.targetdate) errors.targetdate = 'Target Date is required'
        return errors
      }}
      onSubmit={async (values) => {
        try {
          setisLoading(true)
          const url = isAddForm
            ? `${ApiUrl.User}/task`
            : `${ApiUrl.User}/task?id=${data[0]._id}`
          const dateWithTime = TaskInputTimeAndDate(values.targetdate)
          const finalData = { ...values, createdBy: userId, targetdate: dateWithTime }
          const Response = isAddForm
            ? await axios.post(url, finalData)
            : await axios.put(url, finalData)
          if (Response.status === 200) {
            isTaskAdded()
            closePopup()
          }
        } catch (err) {
          console.error(err)
        } finally {
          setisLoading(false)
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <>
          {isLoading && <Loader />}
          <div className="container p-3">
            <div
              className="mx-auto bg-white rounded p-4 "
              style={{ maxWidth: '600px', backdropFilter: 'blur(5px)' }}
            >
              <h4 className="mb-4 text-center">{formName}</h4>
              <form noValidate onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Task Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="Enter task name"
                  />
                  {errors.name && touched.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                    style={{ height: '80px' }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    placeholder="Enter description"
                  />
                  {errors.description && touched.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="assignto" className="form-label">
                    Assign To
                  </label>
                  <select
                    name="assignto"
                    id="assignto"
                    className={`form-select ${errors.assignto && touched.assignto ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.assignto}
                  >
                    <option value="">Please Select</option>
                    {Userslist.map((user, idx) => (
                      <option key={idx} value={user.userId}>
                        {`${user.username} - ${user.designation} (${user.department})`}
                      </option>
                    ))}
                  </select>
                  {errors.assignto && touched.assignto && (
                    <div className="invalid-feedback">{errors.assignto}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="targetdate" className="form-label">
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="targetdate"
                    id="targetdate"
                    className={`form-control ${errors.targetdate && touched.targetdate ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.targetdate}
                  />
                  {errors.targetdate && touched.targetdate && (
                    <div className="invalid-feedback">{errors.targetdate}</div>
                  )}
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </Formik>
  )
}

export default AddTaskForm
