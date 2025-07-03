import { CButton, CCol, CRow, CSpinner } from '@coreui/react'
import TaskCard from '../../../ui/Cards/taskCard'
import SearchBar from '../../../ui/SearchBar/searchbar'
import { useEffect, useState } from 'react'
import PopupLayout from '../../../layout/PopupLayout.js'
import AddTaskForm from '../../../components/form/addTaskForm.js'
import FilterButton from '../../../ui/buttons/filterButton.js'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { UTC_TO_IND_FORMAT } from '../../../utils/dateConvert.js'
import { AnimatePresence } from 'framer-motion'
import SlideDownPopup from '../../../layout/PopupLayout.js/sliderPopup.js'
import { useSelector } from 'react-redux'
import ApiUrl from '../../../services/apiheaders.js'

const taskBadgeColor = [
  { name: 'Discard', color: 'warning' },
  { name: 'OverDue', color: 'danger' },
  { name: 'Completed', color: 'success' },
  { name: 'Not Started', color: 'danger' },
  { name: 'In Progress', color: 'info' },
]

const Task = () => {
  const user_id = useSelector((state) => state.userId)
  const userType = useSelector((state) => state.userType)

  const [isLoading, setIsLoading] = useState(true)
  const [isTaskAdded, setIsTaskAdded] = useState(false)
  const [apiTask, setApiTask] = useState([])
  const [singleTask, setSingleTask] = useState([])
  const [isTaskPopup, setIsTaskPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [active, setActive] = useState("") // <- Default: No filter
  const [deleteTaskId, setDeleteTaskId] = useState('')
  const [showEditTask, setShowEditTask] = useState(false)

  const deleteTask = (id) => {
    setShowDeletePopup(true)
    setDeleteTaskId(id)
  }

  const confirmDeleteTask = async () => {
    try {
      const res = await axios.delete(`${ApiUrl.User}/task?id=${deleteTaskId}&userId=${user_id}`)
      if (res.status === 200) {
        setShowDeletePopup(false)
        setIsTaskAdded(prev => !prev)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const fetchTask = async () => {
    setIsLoading(true)
    const res = await axios.get(`${ApiUrl.User}/task?userId=${user_id}&userType=${userType}&assignToId=null`)
    if (res.status === 200) {
      setApiTask(res.data.data || [])
    }
    setIsLoading(false)
  }

  const editTaskFun = async (id) => {
    setIsLoading(true)
    const res = await axios.get(`${ApiUrl.User}/task/${id}`)
    if (res.status === 200) {
      setSingleTask(res.data.data)
      setShowEditTask(true)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTask()
  }, [isTaskAdded])

  const filteredTasks = apiTask.filter((item) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      item?.name?.toLowerCase().includes(term) ||
      item?.taskid?.toLowerCase().includes(term) ||
      item?.assignto?.toLowerCase().includes(term) ||
      item?.status?.toLowerCase().includes(term) ||
      item?.priority?.toLowerCase().includes(term)

    const createdDate = item?.createdDate ? new Date(item.createdDate) : null
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let matchesFilter = true

    if (createdDate) {
      const taskDate = new Date(createdDate)
      taskDate.setHours(0, 0, 0, 0)

      if (active === 'today') {
        matchesFilter = taskDate.getTime() === today.getTime()
      } else if (active === 'yesterday') {
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        matchesFilter = taskDate.getTime() === yesterday.getTime()
      } else if (active === 'week') {
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay()) // Sunday
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        matchesFilter = taskDate >= weekStart && taskDate <= weekEnd
      } else if (active === 'month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        matchesFilter = taskDate >= monthStart && taskDate <= monthEnd
      }
    }

    return matchesSearch && matchesFilter
  })

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <CSpinner color="primary" />
        </div>
      ) : (
        <div className="container-fluid px-3">
          {/* Header Section */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 flex-wrap py-3">
            <div className={`input-group w-100 w-md-50 search-div ${isFocused ? 'border border-primary shadow-sm' : 'border border-secondary'}`}>
              <SearchBar
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                onFocus={(data) => setIsFocused(data)}
                placeholder={'Search Tasks...'}
              />
            </div>
            <div className="d-flex gap-2">
              <FilterButton
                filterData={['today', 'yesterday', 'week', 'month']}
                active={active}
                onFilterChange={(val) => setActive(val)}
              />
              <CButton color="primary" onClick={() => setIsTaskPopup(true)}>
                <CIcon icon={cilPlus} className="me-2" />
                Add Task
              </CButton>
            </div>
          </div>

          {/* Delete Confirmation Popup */}
          <AnimatePresence>
            {showDeletePopup && (
              <SlideDownPopup
                onClose={() => setShowDeletePopup(false)}
                onConfirm={() => confirmDeleteTask()}
              />
            )}
          </AnimatePresence>

          {/* Task Cards Section */}
          <div className="py-3">
            {filteredTasks.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
                <h1 style={{ fontSize: '3rem' }}>📭</h1>
                <h5 className="text-muted mt-2">No tasks found</h5>
              </div>
            ) : (
              <CRow xs={{ cols: 1 }} sm={{ cols: 2 }} md={{ cols: 3 }} lg={{ cols: 4 }} className="g-4">
                {filteredTasks.map((item, idx) => {
                  const statusColor = taskBadgeColor.find((s) => s.name === item.status)?.color
                  return (
                    <CCol key={idx}>
                      <TaskCard
                        OriginalId={item._id}
                        id={item.taskid}
                        taskName={item.name}
                        taskDesc={item.details}
                        assignedDate={item?.createdDate ? UTC_TO_IND_FORMAT(item.createdDate) : ''}
                        completionDate={item?.targetdate ? UTC_TO_IND_FORMAT(item.targetdate) : ''}
                        status={item.status}
                        assignto={item.assignto}
                        createdBy={item.createdby}
                        taskId={item._id}
                        OnDeleteTask={() => deleteTask(item._id)}
                        OnEditTask={() => editTaskFun(item._id)}
                        color={statusColor}
                        priority={item.priority || 'Medium'}
                      />
                    </CCol>
                  )
                })}
              </CRow>
            )}
          </div>

          {/* Add Task Popup */}
          <PopupLayout show={isTaskPopup} onClose={() => setIsTaskPopup(false)}>
            <AddTaskForm
              isTaskAdded={() => setIsTaskAdded((prev) => !prev)}
              closePopup={() => setIsTaskPopup(false)}
              data={null}
              name={'addTask'}
              formName={'Add New Task'}
              userId={user_id}
            />
          </PopupLayout>

          {/* Edit Task Popup */}
          <PopupLayout show={showEditTask} onClose={() => setShowEditTask(false)}>
            <AddTaskForm
              isTaskAdded={() => setIsTaskAdded((prev) => !prev)}
              closePopup={() => setShowEditTask(false)}
              name={'editTask'}
              data={singleTask}
              formName={'Edit Task'}
            />
          </PopupLayout>
        </div>
      )}
    </>
  )
}

export default Task
