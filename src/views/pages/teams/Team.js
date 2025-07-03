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
  const [teamUsersMap, setTeamUsersMap] = useState({}) // key: teamId, value: teamMembers[]

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

  const fetchTeam = async (openLast = false) => {
    setisLoading(true)
    try {
      const Response = await axios.get(`${ApiUrl.Team}`)
      if (Response.status === 200) {
        const teamList = Response.data.data
        setTeams(teamList)

        const map = {}
        for (const team of teamList) {
          const res = await axios.get(`${ApiUrl.Team}/teamusers?deptId=${team._id}`)
          map[team._id] = res.data?.data || []
        }
        setTeamUsersMap(map)

        if (teamList.length > 0) {
          const defaultIndex = openLast ? teamList.length - 1 : 0
          setOpenIndex(defaultIndex)
        }
      }
    } catch (err) {
      toast.error('Failed to load teams')
    } finally {
      setisLoading(false)
    }
  }

  const refreshTeamUsers = async (teamId) => {
    const res = await axios.get(`${ApiUrl.Team}/teamusers?deptId=${teamId}`)
    setTeamUsersMap((prev) => ({
      ...prev,
      [teamId]: res.data?.data || [],
    }))
    fetchAllUsers() // update available user list across all teams
  }

  useEffect(() => {
    fetchAllUsers()
    fetchTeam()
  }, [])

  const handleAddTeam = async (e) => {
    e.preventDefault()
    const userId = reduxUserId || JSON.parse(localStorage.getItem('user'))?.[0]?.userId

    if (!userId) return toast.error('User not identified')

    try {
      setisLoading(true)
      const Response = await axios.post(`${ApiUrl.Team}`, {
        name: TeamName,
        createdBy: userId,
      })

      if (Response.data.statusCode === 200) {
        toast.success(Response.data.message)
        setisOpenAddTeam(false)
        SetTeamName('')
        await fetchTeam(true)
      } else {
        toast.error(Response.data.message || 'Something went wrong...')
      }
    } catch {
      toast.error('Something went wrong...')
    } finally {
      setisLoading(false)
    }
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
            <div className="col-12 mb-3" key={idx}>
              <ToggleDiv
                data={team}
                index={idx}
                isOpen={openIndex === idx}
                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                TeamMembers={teamUsersMap[team._id] || []}
                allUsers={allUsers}
                refreshTeam={() => refreshTeamUsers(team._id)}
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
