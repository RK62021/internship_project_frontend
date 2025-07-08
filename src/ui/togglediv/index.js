import CIcon from '@coreui/icons-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Button from '../buttons'
import { cilPlus } from '@coreui/icons'
import { FaTrash } from 'react-icons/fa'
import { formatDateToDMYHM } from '../../utils/dateConvert'
import ApiUrl from '../../services/apiheaders'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const ToggleDiv = ({ TeamMembers, data, isOpen, onToggle, allUsers, refreshTeam, refreshAllUsers }) => {
  const user_id = useSelector((state) => state.userId)
  const [userList, setUserList] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [isUserPopup, setIsUserPopup] = useState(false)

  // ⏺️ Filter out users already in team
  useEffect(() => {
    if (allUsers?.length >= 0 && TeamMembers !== undefined) {
      const memberIds = new Set((TeamMembers || []).map((member) => member._id))
      const availableUsers = allUsers.filter((user) => !memberIds.has(user._id))
      setUserList(availableUsers)
    }
  }, [allUsers, TeamMembers])

  const handleAddTeamMember = async () => {
    if (!selectedUser) {
      toast.warning('Please select a user.')
      return
    }

    try {
      const response = await axios.post(`${ApiUrl.Team}/member`, {
        userid: selectedUser,
        departmentid: data._id,
        addedby: user_id,
      })

      if (response.status === 200 || response.data.success === true) {
        toast.success('User added to team')
        setIsUserPopup(false)
        setSelectedUser('')
        await refreshTeam()
        await refreshAllUsers()
      } else {
        toast.error('Failed to add user')
      }
    } catch (err) {
      toast.error('Error adding user')
    }
  }

  const handleRemoveTeamMember = async (userId) => {
    if (!userId) {
      toast.warning('Invalid user ID')
      return
    }

    try {
      const response = await axios.post(`${ApiUrl.Team}/removeuserfromteam`, {
        userId: userId,
        teamId: data._id,
      })

      if (response.status === 200 || response.data.success === true) {
        toast.success('User removed from team')
        await refreshTeam()
        await refreshAllUsers()
      } else {
        toast.error('Failed to remove user')
      }
    } catch (error) {
      toast.error('Error removing user')
    }
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#FFFFFF' }}>
      {/* Accordion Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <span>{data.name}</span>
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{isOpen ? '-' : '+'}</span>
      </div>

      {isOpen && (
        <div>
          {/* Add Member Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button
              name="Add Member"
              icon={<CIcon icon={cilPlus} />}
              onClick={() => setIsUserPopup(true)}
            />
          </div>

          {/* Team Members Table */}
          <div style={{ overflowX: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e0e0e0', textAlign: 'left' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Action</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>User</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Mobile</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Department</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Designation</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Reporting To</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd' }}>Added On</th>
                </tr>
              </thead>
              <tbody>
                {TeamMembers?.map((team, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveTeamMember(team._id)}
                        title="Remove Member"
                      >
                        <FaTrash />
                      </button>
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.fullName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.email}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.mobile}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.departmentName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.designationName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.reportingToName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {formatDateToDMYHM(team?.addedDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isUserPopup && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Team Member</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsUserPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="userSelect" className="form-label">Select User</label>
                <select
                  className="form-select"
                  id="userSelect"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">-- Select a User --</option>
                  {userList.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsUserPopup(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddTeamMember}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ToggleDiv
