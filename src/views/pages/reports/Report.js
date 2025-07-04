import {
  CButton,
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
import DumpReport from './DumpReport'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'
import Analytics from './Analytics'

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

  const handleExportListReport = async () => {
    if (!RepoerData.length) {
      toast.warn('No report data to export.')
      return
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Report List')

    worksheet.columns = [
      { header: '#', key: 'index', width: 5 },
      { header: 'User', key: 'name', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Designation', key: 'designation', width: 20 },
      { header: 'Completed', key: 'completedTasks', width: 15 },
      { header: 'In Progress', key: 'pendingTasks', width: 15 },
      { header: 'Not Started', key: 'notStartedTasks', width: 15 },
      { header: 'Discarded', key: 'Discard', width: 15 },
      { header: 'Total', key: 'totalTasks', width: 10 },
    ]

    RepoerData.forEach((item, idx) => {
      worksheet.addRow({
        index: idx + 1,
        ...item,
      })
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
      cell.alignment = { horizontal: 'center' }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' },
      }
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    saveAs(blob, `Report_List_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <div className="container-fluid px-3">
      {/* Header */}
      <div className="row align-items-center my-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <h2 className="fw-bold text-dark">Reports</h2>
          <p className="text-muted">View and generate task reports</p>
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
            active={activeTab === 'dump'}
            onClick={() => setActiveTab('dump')}
            style={{ cursor: 'pointer' }}
          >
            Dump Report
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

      {/* Report List Tab */}
      {activeTab === 'list' && (
        <CCardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">📋 Report List</h5>
            {RepoerData.length > 0 && (
              <CButton color="success" onClick={handleExportListReport}>
                ⬇️ Export Report
              </CButton>
            )}
          </div>

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
                    <td colSpan="9" className="text-muted">
                      No data available
                    </td>
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
      )}

      {/* Dump Report Tab */}
      {activeTab === 'dump' && <DumpReport />}

      {/* Analytics Tab */}
      {activeTab === 'analytic' && <Analytics />}
    </div>
  )
}

export default Reports
