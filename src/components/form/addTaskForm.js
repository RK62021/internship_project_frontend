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
  const [isLoading, setIsLoading] = useState(false)

  const fetchUser = async () => {
    try {
      const currentUserId = GetLocalStorage('user')?.[0]?.userId
      const response = await axios.get(`${ApiUrl.User}/userlist`)
      setUserslist(response?.data?.data || [])
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
        name: data?.[0]?.name || '',
        description: data?.[0]?.details || '',
        targetdate: data?.[0]?.targetdate ? formatDateToInput(data[0].targetdate) : '',
        assignto: data?.[0]?.assigntoId || '',
        priority: data?.[0]?.priority || '',
      }}
      validate={(values) => {
        const errors = {}
        if (!values.name) errors.name = 'Task name is required'
        if (!values.description) errors.description = 'Description is required'
        if (!values.assignto) errors.assignto = 'Assign To is required'
        if (!values.targetdate) errors.targetdate = 'Target Date is required'
        if (!values.priority) errors.priority = 'Priority is required'
        return errors
      }}
      onSubmit={async (values) => {
        try {
          setIsLoading(true)
          const url = isAddForm
            ? `${ApiUrl.User}/task`
            : `${ApiUrl.User}/task?id=${data?.[0]?._id}`

          const dateWithTime = TaskInputTimeAndDate(values.targetdate)
          const finalData = {
            ...values,
            createdBy: userId,
            targetdate: dateWithTime,
            priority: values.priority || 'Medium',
          }

          const response = isAddForm
            ? await axios.post(url, finalData)
            : await axios.put(url, finalData)

          if (response.status === 200) {
            isTaskAdded()
            closePopup()
          }
        } catch (err) {
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <>
          {isLoading && <Loader />}
          <div className="container p-3">
            <div
              className="mx-auto bg-white rounded p-4"
              style={{ maxWidth: '600px', backdropFilter: 'blur(5px)' }}
            >
              <h4 className="mb-4 text-center">{formName}</h4>
              
              <hr className="my-4 border-2 border-dark rounded opacity-100 custom-hr" />

              <form noValidate onSubmit={handleSubmit}>
                {/* Task Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Task Name</label>
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

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
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

                {/* Assign To */}
                <div className="mb-3">
                  <label htmlFor="assignto" className="form-label">Assign To</label>
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
                        {`${user.fullName} - ${user.designation} (${user.department})`}
                      </option>
                    ))}
                  </select>
                  {errors.assignto && touched.assignto && (
                    <div className="invalid-feedback">{errors.assignto}</div>
                  )}
                </div>

                {/* Priority */}
                <div className="mb-3">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select
                    name="priority"
                    id="priority"
                    className={`form-select ${errors.priority && touched.priority ? 'is-invalid' : ''}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.priority}
                  >
                    <option value="">Please Select</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  {errors.priority && touched.priority && (
                    <div className="invalid-feedback">{errors.priority}</div>
                  )}
                </div>

                {/* Target Date */}
                <div className="mb-3">
                  <label htmlFor="targetdate" className="form-label">Target Date</label>
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

                {/* Submit */}
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
