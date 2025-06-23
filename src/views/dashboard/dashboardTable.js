import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ApiUrl from '../../services/apiheaders'
import Loader from '../../ui/Loader'

const UserTaskTable = () => {
  const [teams, setTeams] = useState([])
  const [openIndex, setOpenIndex] = useState(null)
  const [teamUserTasks, setTeamUserTasks] = useState({})
  const [loading, setLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const userType = user?.userType || 'User'
  const userId = user?.userId || user?.[0]?.userId || 'defaultUserId'

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${ApiUrl.Team}`)
      if (res.status === 200) {
        setTeams(res.data.data || [])
      }
    } catch (err) {
      console.error('Error fetching teams:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeamUserTasks = async (teamId, idx) => {
    if (teamUserTasks[teamId]) {
      setOpenIndex(openIndex === idx ? null : idx)
      return
    }

    try {
      setLoading(true)
      const res = await axios.get(`${ApiUrl.User}/user-task-report`, {
        params: {
          userType,
          userId,
          teamId,
        },
      })

      if (res.status === 200) {
        setTeamUserTasks((prev) => ({
          ...prev,
          [teamId]: res.data.data || [],
        }))
        setOpenIndex(idx)
      }
    } catch (error) {
      console.error('Error fetching team user tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  return (
    <CCard className="border-0 shadow-sm">
      <CCardBody className="p-4">
        {loading && <Loader />}
        <h5 className="fw-bold mb-4">📊 Team-wise Task Breakdown</h5>

        {teams.length === 0 && !loading && (
          <div className="text-center text-muted py-4">No teams found.</div>
        )}

        {teams.map((team, idx) => (
          <div key={team._id} className="mb-4">
            <div
              className="d-flex justify-content-between align-items-center bg-light p-3 rounded border shadow-sm"
              style={{ cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => fetchTeamUserTasks(team._id, idx)}
            >
              <span>👥 {team.name}</span>
              <span style={{ fontSize: '18px' }}>{openIndex === idx ? '▲' : '▼'}</span>
            </div>

            {openIndex === idx && (
              <>
                {teamUserTasks[team._id]?.length === 0 ? (
                  <div className="text-muted text-center py-3">No users in this team.</div>
                ) : (
                  <CTable hover striped responsive className="mt-3 border">
                    <CTableHead color="primary">
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Department</CTableHeaderCell>
                        <CTableHeaderCell>Designation</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Total Tasks</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Completed</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Pending</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {teamUserTasks[team._id].map((user, index) => (
                        <CTableRow key={user._id || index}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{user.name}</CTableDataCell>
                          <CTableDataCell>{user.department}</CTableDataCell>
                          <CTableDataCell>{user.designation}</CTableDataCell>
                          <CTableDataCell className="text-center">{user.totalTasks}</CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CBadge color="success" shape="rounded-pill">
                              {user.completedTasks}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <Link to={`/dashboard/pending-tasks/${user._id || index}`}>
                              <CBadge
                                color="danger"
                                shape="rounded-pill"
                                style={{ cursor: 'pointer' }}
                              >
                                {user.pendingTasks}
                              </CBadge>
                            </Link>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </>
            )}
          </div>
        ))}
      </CCardBody>
    </CCard>
  )
}

export default UserTaskTable
