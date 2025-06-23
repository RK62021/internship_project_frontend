import axios from 'axios'
import { useEffect, useState } from 'react'
import ToggleDiv from '../../../ui/togglediv'
import PopupLayout from '../../../layout/PopupLayout.js'
import { toast } from 'react-toastify'
import ApiUrl from '../../../services/apiheaders.js'
import Loader from '../../../ui/Loader/index.js'
import { useSelector } from 'react-redux'

const Team = () => {
  const [Teams, setTeams] = useState([])
  const [openIndex, setOpenIndex] = useState(null)
  const [isOpenAddTeam, setisOpenAddTeam] = useState(false)
  const [TeamName, SetTeamName] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [TeamMembers, setTeamMembers] = useState([])
  const user = useSelector((state) => state.userType)

  const fetchTeam = async () => {
    setisLoading(true)
    try {
      const Response = await axios.get(`${ApiUrl.Team}`)
      if (Response.status === 200) {
        const teamList = Response.data.data
        setTeams(teamList)

        // Open first team by default
        if (teamList.length > 0) {
          await OnToggleFun(0, teamList[0]._id)
        }
      }
    } catch (err) {
      toast.error("Failed to load teams")
    } finally {
      setisLoading(false)
    }
  }

  const OnToggleFun = async (idx, teamid) => {
    try {
      // If switching to a new team
      if (openIndex !== idx) {
        setisLoading(true)
        const Response = await axios.get(`${ApiUrl.Team}/teamusers?deptId=${teamid}`)
        if (Response.data.statusCode === 200) {
          setTeamMembers(Response.data.data)
          setOpenIndex(idx)
        } else {
          toast.error("Something went wrong...")
        }
        setisLoading(false)
      } else {
        // Close the currently open panel
        setOpenIndex(null)
      }
    } catch (err) {
      toast.error("Something went wrong...")
      setisLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  const handleAddTeam = async (e) => {
    e.preventDefault()
    try {
      setisLoading(true)
      const user = JSON.parse(localStorage.getItem('user'))
      const userId = user[0]?.userId

      const Response = await axios.post(`${ApiUrl.Team}`, {
        name: TeamName,
        createdBy: userId,
      })

      if (Response.data.statusCode === 200) {
        toast.success(Response.data.message)
        setisOpenAddTeam(false)
        SetTeamName('')
        fetchTeam()
      } else if (Response.data.statusCode === 409) {
        toast.warn(Response.data.message)
      } else {
        toast.error("Something went wrong...")
      }
    } catch (error) {
      console.error("Error adding team:", error)
      toast.error("Something went wrong...")
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
            <p>Manage and track team tasks</p>
          </div>
          {(user === 'Admin' || user === 'SuperAdmin') && (
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
                onToggle={() => OnToggleFun(idx, team._id)}
                TeamMembers={openIndex === idx ? TeamMembers : []}
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
            <h5 className="mb-3">Create new Team</h5>
            <div className="mb-3">
              <label htmlFor="teamname" className="form-label">Team Name</label>
              <input
                type="text"
                name="teamname"
                className="form-control"
                onChange={(e) => SetTeamName(e.target.value)}
                value={TeamName}
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
