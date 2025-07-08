import axios from 'axios'
import { useEffect, useState } from 'react'
import ToggleDiv from '../../../ui/togglediv'
import PopupLayout from '../../../layout/PopupLayout.js'
import { toast } from 'react-toastify'
import ApiUrl from '../../../services/apiheaders.js'
import Loader from '../../../ui/Loader/index.js'
import { useSelector } from 'react-redux'

const Team = () => {
  const userType = useSelector((state) => state.userType)
  const reduxUserId = useSelector((state) => state.userId)

  const [Teams, setTeams] = useState([])
  const [openIndex, setOpenIndex] = useState(null)
  const [isOpenAddTeam, setisOpenAddTeam] = useState(false)
  const [TeamName, SetTeamName] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [teamUsersMap, setTeamUsersMap] = useState({})
  const [teamLoadingMap, setTeamLoadingMap] = useState({})

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${ApiUrl.User}/all`)
      if (response.status === 200) {
        setAllUsers(response.data.data || [])
      }
    } catch (error) {
      toast.error('Failed to fetch users')
    }
  }

  const fetchTeams = async () => {
    setisLoading(true)
    try {
      const response = await axios.get(`${ApiUrl.Team}`)
      if (response.status === 200) {
        const teamList = response.data.data || []
        setTeams(teamList)

        if (teamList.length > 0) {
          const firstTeamId = teamList[0]._id
          setOpenIndex(0)
          await handleToggle(0, firstTeamId)
        }
      }
    } catch (err) {
      toast.error('Failed to load teams')
    } finally {
      setisLoading(false)
    }
  }

  const handleToggle = async (idx, teamId) => {
    if (!teamUsersMap[teamId]) {
      setTeamLoadingMap(prev => ({ ...prev, [teamId]: true }))
      try {
        const res = await axios.get(`${ApiUrl.Team}/teamusers?deptId=${teamId}`)
        setTeamUsersMap(prev => ({
          ...prev,
          [teamId]: res.data?.data || []
        }))
      } catch {
        toast.error('Failed to load team members')
      } finally {
        setTeamLoadingMap(prev => ({ ...prev, [teamId]: false }))
      }
    }
    setOpenIndex(prev => (prev === idx ? null : idx))
  }

  const refreshTeamUsers = async (teamId) => {
    const res = await axios.get(`${ApiUrl.Team}/teamusers?deptId=${teamId}`)
    setTeamUsersMap((prev) => ({
      ...prev,
      [teamId]: res.data?.data || [],
    }))
  }

  useEffect(() => {
    fetchAllUsers()
    fetchTeams()
  }, [])

  const handleAddTeam = async (e) => {
    e.preventDefault()
    const userId = reduxUserId || JSON.parse(localStorage.getItem('user'))?.[0]?.userId
    if (!userId) return toast.error('User not identified')

    try {
      setisLoading(true)
      const res = await axios.post(`${ApiUrl.Team}`, {
        name: TeamName,
        createdBy: userId,
      })

      if (res.data.statusCode === 200) {
        toast.success(res.data.message)
        setisOpenAddTeam(false)
        SetTeamName('')
        await fetchTeams()
        await fetchAllUsers()
      } else {
        toast.error(res.data.message || 'Something went wrong...')
      }
    } catch {
      toast.error('Something went wrong...')
    } finally {
      setisLoading(false)
    }
  }

  const refreshAllUsers = async () => {
    await fetchAllUsers()
  }

  return (
    <>
      {isLoading && <Loader />}

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2>Team</h2>
            <p className="text-muted">Manage and track team tasks</p>
          </div>
          {(userType === 'Admin' || userType === 'SuperAdmin') && (
            <button className="btn btn-primary" onClick={() => setisOpenAddTeam(true)}>
              <i className="bi bi-plus-circle me-2"></i> New Team
            </button>
          )}
        </div>

        <div className="row">
          {Teams?.map((team, idx) => (
            <div className="col-12 mb-3" key={team._id}>
              <ToggleDiv
                data={team}
                index={idx}
                isOpen={openIndex === idx}
                onToggle={() => handleToggle(idx, team._id)}
                TeamMembers={teamUsersMap[team._id] || []}
                allUsers={allUsers}
                refreshTeam={() => refreshTeamUsers(team._id)}
                refreshAllUsers={refreshAllUsers}
                isTeamLoading={teamLoadingMap[team._id] || false}
              />
            </div>
          ))}
        </div>
      </div>

      {isOpenAddTeam && (
        <PopupLayout show={isOpenAddTeam} onClose={() => setisOpenAddTeam(false)}>
          <form
            onSubmit={handleAddTeam}
            className="bg-white p-4 rounded"
            style={{ maxWidth: '500px', width: '100%' }}
          >
            <h5 className="mb-3">Create New Team</h5>
            <div className="mb-3">
              <label htmlFor="teamname" className="form-label">Team Name</label>
              <input
                type="text"
                id="teamname"
                className="form-control"
                value={TeamName}
                onChange={(e) => SetTeamName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              <i className="bi bi-check-circle me-2"></i> Submit
            </button>
          </form>
        </PopupLayout>
      )}
    </>
  )
}

export default Team