import CIcon from '@coreui/icons-react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from '../buttons';
import { cilPlus } from '@coreui/icons';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { formatDateToDMYHM } from '../../utils/dateConvert';
import { useParams } from 'react-router-dom';
import ApiUrl from '../../services/apiheaders';
import { toast } from 'react-toastify';

const ToggleDiv = ({ TeamMembers, data, index, isOpen, onToggle }) => {
  const { id } = useParams();
  const childRef = useRef();
  const [TeamMember, setTeamMember] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isUserPopup, setIsUserPopup] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  const handleClick = () => {
    childRef.current?.focusInput();
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiUrl.User}/all`);
      if (response.status === 200) {
        setUserList(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleAddTeamMember = async () => {
    if (!selectedUser) {
      alert('Please select a user.');
      return;
    }

    try {
      const response = await axios.post(`${ApiUrl.Team}/addusertoteam`, {
        userId: selectedUser,
        teamId: data._id,
      });

      if (response.data.statusCode === 200) {
        toast.success('User added to team');
        setIsUserPopup(false);
        setSelectedUser('');
        onToggle();
      } else {
        toast.error('Failed to add user');
      }
    } catch (err) {
      toast.error('Error adding user');
    }
  };

  useEffect(() => {
    // fetchUsers();
  }, []);

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#FFFFFF' }}>
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
        <div >
          <div className="team-toggle-div">
            {/* <div
              style={{ width: '211px', height: '30px', textAlign: 'right' }}
              onClick={handleClick}
            >
              <Button
                name="Add Team Member"
                icon={<CIcon icon={cilPlus} />}
                onClick={() => setIsUserPopup(true)}
              />
            </div> */}
          </div>

          <div style={{ overflowX: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#e0e0e0', textAlign: 'left' }}>
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
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.fullName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.email}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.mobile}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.departmentName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.designationName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{team.reportingToName}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDateToDMYHM(team?.addedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsUserPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddTeamMember}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToggleDiv;
