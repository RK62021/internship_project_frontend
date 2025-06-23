import {
  CButton,
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import FilterButton from '../../../ui/buttons/filterButton'
import axios from 'axios'
import ApiUrl from '../../../services/apiheaders'
import { useSelector } from 'react-redux'

const Reports = () => {
  const [activeTab, setActiveTab] = useState('list')
  const UserType = useSelector((state) => state.userType)
  const userId = useSelector((state) => state.userId)
  const [RepoerData, setRepoerData] = useState([])

  const fetchReport = async () => {
    try {
      const Response = await axios.get(
        `${ApiUrl.User}/task/report?userType=${UserType}&userId=${userId}`
      )
      if (Response.data.statusCode === 200) {
        setRepoerData(Response.data.data)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  return (
    <div className="container-fluid px-3">
      {/* Header */}
      <div className="row align-items-center my-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <h2 className="fw-bold text-dark">Reports</h2>
          <p className="text-muted">View and generate task reports</p>
        </div>
        <div className="col-12 col-md-6 d-flex flex-wrap justify-content-md-end gap-2">
          <FilterButton filterData={['today', 'upcoming', 'dead']} active={true} />
          <CButton color="info" className="text-white">Generate Report</CButton>
        </div>
      </div>

      {/* Navigation Tabs */}
      <CNav variant="tabs" className="mb-3">
        <CNavItem>
          <CNavLink
            active={activeTab === 'list'}
            onClick={() => setActiveTab('list')}
            style={{ cursor: 'pointer' }}
          >
            Report List
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 'analytic'}
            onClick={() => setActiveTab('analytic')}
            style={{ cursor: 'pointer' }}
          >
            Analytic
          </CNavLink>
        </CNavItem>
      </CNav>

      {/* Report Table */}
      {/* <CCard className="border-0 shadow-sm"> */}
        <CCardBody>
          <div className="table-responsive">
            <table className="table align-middle table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th className="text-success">Completed</th>
                  <th className="text-primary">In Progress</th>
                  <th className="text-warning">Not Started</th>
                  <th className="text-danger">Discarded</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {RepoerData?.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-muted">No data available</td>
                  </tr>
                ) : (
                  RepoerData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.department}</td>
                      <td>{item.designation}</td>
                      <td className="text-success">{item.completedTasks}</td>
                      <td className="text-primary">{item.pendingTasks}</td>
                      <td className="text-warning">{item?.notStartedTasks || 0}</td>
                      <td className="text-danger">{item?.Discard || 0}</td>
                      <td className="fw-semibold">{item.totalTasks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CCardBody>
      {/* </CCard> */}
    </div>
  )
}

export default Reports
