import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import Loader from '../Loader'
import { formatDateToDMYHM } from '../../utils/dateConvert'
import { StatusOption } from '../../utils/OptionList'
import PopupLayout from '../../layout/PopupLayout.js'
import { useNavigate } from 'react-router-dom'
import ApiUrl from '../../services/apiheaders'
import { FaPlus } from 'react-icons/fa'
import TaskActivityTab from './TaskActivityTab.js'
import TaskAttachment from './TaskAttachment.js'

const tabs = [
  { id: 1, label: 'Task Details' },
  { id: 2, label: 'Task Activity' },
  { id: 3, label: 'Notes' },
  { id: 4, label: 'Attachment' },
]

const MultiSelectTabs = ({ data, notesData, update, taskId }) => {
  const navigate = useNavigate()
  const UserId = useSelector((state) => state.userId)

  const [selectedTabs, setSelectedTabs] = useState(1)
  const [UserOptioList, setUserOptioList] = useState([])
  const [StatusOptioList, setStatusOptioList] = useState([])

  const [UpdatedTask, setUpdatedTask] = useState({
    assigntoId: '',
    statusId: '',
    details: '',
    priority: '',
  })
  const [InitialTask, setInitialTask] = useState({
    assigntoId: '',
    statusId: '',
    details: '',
    priority: '',
  })

  const [Remarks, setRemarks] = useState('')
  const [openRemarks, setopenRemarks] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [notesLoading, setNotesLoading] = useState(false)
  const [OpenNotesPopup, setOpenNotesPopup] = useState(false)
  const [Notes, setNotes] = useState('')
  const [TaskDetailsNotes, setTaskDetailsNotes] = useState(null)
  const [notesList, setNotesList] = useState([])

  const PriorityTag = ['High', 'Medium', 'Low']

  const fetchUser = async () => {
    try {
      const userId = UserId || JSON.parse(localStorage.getItem('user'))?.[0]?.userId
      const response = await axios.get(`${ApiUrl.User}/userlistcustom/?userId=${userId}`)
      const status = await StatusOption()
      setStatusOptioList(status)
      setUserOptioList(response?.data?.data)
    } catch {
      toast.error('Failed to load user/status data')
    }
  }

  const fetchnotesList = async () => {
    try {
      setNotesLoading(true)
      const response = await axios.get(`${ApiUrl.User}/notes?taskId=${data[0]?._id}`)
      if (response.status === 200) setNotesList(response.data.data)
      else toast.error('Failed to fetch notes')
    } catch {
      toast.error('Failed to fetch notesList')
    } finally {
      setNotesLoading(false)
    }
  }

  const toggleTab = async (id) => {
    if (id === 3 && notesList.length === 0) await fetchnotesList()
    setSelectedTabs(id)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'statusId') {
      setopenRemarks(value === '684bc6e93c9d30e5d63e35c0' || value === 'abc123456completedid')
    }
    setUpdatedTask((prev) => ({ ...prev, [name]: value }))
  }

  const isTaskChanged = () =>
    UpdatedTask.assigntoId !== InitialTask.assigntoId ||
    UpdatedTask.statusId !== InitialTask.statusId ||
    UpdatedTask.details !== InitialTask.details ||
    UpdatedTask.priority !== InitialTask.priority

  const handleCancel = () => {
    setUpdatedTask(InitialTask)
    setRemarks('')
    setopenRemarks(InitialTask.statusId === '684bc6e93c9d30e5d63e35c0')
    navigate('/task')
  }

  const handleSubmit = async () => {
    const userId = UserId || JSON.parse(localStorage.getItem('user'))?.[0]?.userId
    const UpdatedTasks = {
      ...UpdatedTask,
      remarks: openRemarks ? Remarks : '',
      id: data[0]?.taskid,
      updatedBy: userId,
      priority: UpdatedTask.priority || 'Medium',
    }
    const Response = await axios.put(`${ApiUrl.User}/task`, UpdatedTasks)
    if (Response.data.statusCode === 200 || Response.data.success ===true) navigate('/task')
      update()
  }

  const AddNotesfun = async () => {
    try {
      setisLoading(true)
      const Payload = { taskId: data[0]?._id, notes: Notes, userId: UserId }
      const Response = await axios.post(`${ApiUrl.User}/notes`, Payload)
      if (Response.data.statusCode === 200) {
        setOpenNotesPopup(false)
        toast.success('Notes added...')
        await fetchnotesList() 
        // update()
        setNotes('')
      }
    } catch {
      toast.error('Something went wrong..')
    } finally {
      setisLoading(false)
    }
  }

  useEffect(() => {
    setTaskDetailsNotes(notesData)
    fetchUser()
    if (data?.[0]) {
      const initial = {
        assigntoId: data[0].assigntoId || '',
        statusId: data[0].statusId || '',
        details: data[0].details || '',
        priority: data[0].priority || '',
      }
      setUpdatedTask(initial)
      setInitialTask(initial)
    }
  }, [data])

  return (
    <div className="container mt-3">
      {isLoading && (
        <div
          className="position-fixed w-100 h-100 top-0 start-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}
        >
          <Loader />
        </div>
      )}
      <ToastContainer />

      {OpenNotesPopup && (
        <PopupLayout show={OpenNotesPopup} onClose={() => setOpenNotesPopup(false)}>
          <div className="card p-3">
            <h5 className="card-title">Add Notes</h5>
            <textarea
              className="form-control mb-3"
              rows={4}
              placeholder="Type your notes here..."
              value={Notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            <button className="btn btn-primary" onClick={AddNotesfun} disabled={!Notes.trim()}>
              Submit Note
            </button>
          </div>
        </PopupLayout>
      )}

      <ul className="nav nav-pills mb-3">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              onClick={() => toggleTab(tab.id)}
              className={`nav-link ${selectedTabs === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={() => setOpenNotesPopup(true)}>
          <FaPlus className="me-2" /> Add Notes
        </button>
      </div>

      <div
        key={selectedTabs}
        className="tab-content card p-4 shadow-sm fade-in"
        style={{ minHeight: '400px' }}
      >
        {selectedTabs === 1 && (
          <>
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Task ID</label>
                <p className="fw-semibold">{data[0]?.taskid || 'N/A'}</p>
              </div>
              <div className="col-md-4">
                <label>Created At</label>
                <p className="fw-semibold">{formatDateToDMYHM(data[0]?.createdDate) || 'N/A'}</p>
              </div>
              <div className="col-md-4">
                <label>Created By</label>
                <p className="fw-semibold">{data[0]?.createdBy?.toUpperCase() || 'N/A'}</p>
              </div>
            </div>
            <hr className="mb-4" />
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Status</label>
                <select
                  name="statusId"
                  value={UpdatedTask.statusId}
                  onChange={handleChange}
                  className="form-select"
                >
                  {StatusOptioList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label>Assigned To</label>
                <select
                  name="assigntoId"
                  value={UpdatedTask.assigntoId}
                  onChange={handleChange}
                  className="form-select"
                >
                  {UserOptioList.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label>Priority</label>
                <select
                  name="priority"
                  value={UpdatedTask.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Priority</option>
                  {PriorityTag.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>First Open Time</label>
                <p className="fw-semibold">
                  {formatDateToDMYHM(data[0]?.isOpenFirstTimeDate) || 'N/A'}
                </p>
              </div>
              <div className="col-md-6">
                <label>Target Date</label>
                <p className=" fw-semibold">
                  {formatDateToDMYHM(data[0]?.targetDate || data[0]?.targetdate) || 'N/A'}
                </p>
              </div>
            </div>

            <div className="form-floating mb-3">
              <textarea
                name="details"
                className="form-control"
                id="floatingDesc"
                placeholder="Task Description"
                value={UpdatedTask.details}
                onChange={handleChange}
                style={{ height: '120px' }}
              ></textarea>
              <label htmlFor="floatingDesc">Task Description</label>
            </div>
            {TaskDetailsNotes && (
              <div className="mb-3">
                <label>Notes:</label>
                <div className="form-control bg-light">{TaskDetailsNotes.notes}</div>
              </div>
            )}
            {openRemarks && (
              <div className="mb-3">
                <label className="text-danger">Remarks *</label>
                <textarea
                  className="form-control"
                  placeholder="Please enter remarks before submit"
                  rows={3}
                  value={Remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
            )}
            <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
              <button
                className="btn btn-success"
                disabled={
                  (UpdatedTask.statusId === '684bc6e93c9d30e5d63e35c0' && Remarks.trim() === '') ||
                  !isTaskChanged()
                }
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button className="btn btn-outline-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        )}

        {selectedTabs === 2 && <TaskActivityTab taskId={taskId} />}

        {selectedTabs === 3 && (
          <div className="fade-in" style={{ minHeight: '300px' }}>
            {notesLoading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Loader small />
              </div>
            ) : notesList?.length > 0 ? (
              notesList.map((note, idx) => (
                <div key={idx} className="mb-3 border rounded p-3 bg-light">
                  <div className="d-flex align-items-center mb-2">
                    <div
                      className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center"
                      style={{ width: 40, height: 40 }}
                    >
                      {note.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0">{note.userName}</h6>
                      <small className="text-muted">{formatDateToDMYHM(note.addedDate)}</small>
                    </div>
                  </div>
                  <p className="mb-0">{note.notes}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">No notes available for this task.</p>
            )}
          </div>
        )}
        {selectedTabs === 4 && <TaskAttachment taskId={data[0]?._id} />}
      </div>
    </div>
  )
}

export default MultiSelectTabs
