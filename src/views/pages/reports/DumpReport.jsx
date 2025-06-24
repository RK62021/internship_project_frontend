import React, { useEffect, useState } from 'react'
import {
  CButton,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react'
import { toast } from 'react-toastify'
import axios from 'axios'
import ApiUrl from '../../../services/apiheaders'

const DumpReport = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    team: '',
    priority: '',
    status: '',
  })

  const [allResults, setAllResults] = useState([])  // full data from backend
  const [results, setResults] = useState([])         // filtered frontend data
  const [Teams, setTeams] = useState([])

  const priorities = ['High', 'Medium', 'Low']
  const statuses = ['Not Started', 'In Progress', 'Completed', 'Discarded']

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${ApiUrl.Team}`)
        if (response.status === 200) {
          setTeams(response.data.data || [])
        }
      } catch (err) {
        toast.error('Failed to load teams')
      }
    }
    fetchTeam()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedFilters = { ...filters, [name]: value }
    setFilters(updatedFilters)

    // Re-apply frontend filters only if dropdown values change
    if (['team', 'priority', 'status'].includes(name)) {
      applyFrontendFilters(allResults, updatedFilters)
    }
  }

  const handleSearch = async () => {
    const { fromDate, toDate } = filters

    if (!fromDate || !toDate) {
      toast.error('Please select both From Date and To Date.')
      return
    }

    try {
      const response = await axios.post(`${ApiUrl.User}/Dump-Report`, {
        fromDate,
        toDate,
      })

      if (response.status === 200) {
        const rawData = response.data.data || []
        setAllResults(rawData)
        toast.success('Dump report data fetched successfully.')
        applyFrontendFilters(rawData, filters)
      } else {
        toast.error('Failed to fetch dump report data.')
      }
    } catch (error) {
      toast.error('Server error while fetching dump report.')
      console.error(error)
    }
  }

  const applyFrontendFilters = (data, currentFilters) => {
    const { team, priority, status } = currentFilters

    const filtered = data.filter((item) => {
      const teamMatch = team ? item.team === team : true
      const priorityMatch = priority ? item.priority === priority : true
      const statusMatch = status ? item.status === status : true
      return teamMatch && priorityMatch && statusMatch
    })

    setResults(filtered)
  }

  const getBadgeColor = (type, value) => {
    if (!value) return 'secondary'
    const val = value.toLowerCase()
    if (type === 'status') {
      if (val === 'completed') return 'success'
      if (val === 'in progress') return 'primary'
      if (val === 'not started') return 'warning'
      if (val === 'discarded') return 'danger'
    }
    if (type === 'priority') {
      if (val === 'high') return 'danger'
      if (val === 'medium') return 'warning'
      if (val === 'low') return 'info'
    }
    return 'secondary'
  }

  return (
    <div className="py-4">
      <h5 className="fw-bold mb-3">🗑️ Dump Report</h5>
      <p className="text-muted">Filter and view deleted or discarded tasks</p>

      {/* Filter Section */}
      <CForm className="mb-4">
        <CRow className="g-3">
          <CCol md={3}>
            <CFormLabel>From Date <span className="text-danger">*</span></CFormLabel>
            <CFormInput
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={3}>
            <CFormLabel>To Date <span className="text-danger">*</span></CFormLabel>
            <CFormInput
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={2}>
            <CFormLabel>Team</CFormLabel>
            <CFormSelect name="team" value={filters.team} onChange={handleChange}>
              <option value="">All</option>
              {Teams.map((team) => (
                <option key={team._id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={2}>
            <CFormLabel>Priority</CFormLabel>
            <CFormSelect name="priority" value={filters.priority} onChange={handleChange}>
              <option value="">All</option>
              {priorities.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={2}>
            <CFormLabel>Status</CFormLabel>
            <CFormSelect name="status" value={filters.status} onChange={handleChange}>
              <option value="">All</option>
              {statuses.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={12} className="d-flex justify-content-end mt-2">
            <CButton color="primary" onClick={handleSearch}>
              🔍 See Results
            </CButton>
          </CCol>
        </CRow>
      </CForm>

      {/* Results Table */}
      {results.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Task ID</th>
                <th>Task Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {results.map((task, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{task.taskId}</td>
                  <td>{task.taskName}</td>
                  <td>{task.date}</td>
                  <td>
                    <span className={`badge bg-${getBadgeColor('status', task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${getBadgeColor('priority', task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-muted mt-4">No dump report data to display.</div>
      )}
    </div>
  )
}

export default DumpReport
