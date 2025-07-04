import React, { useEffect, useState } from 'react'
import { CChartPie } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import axios from 'axios'
import ApiUrl from '../../services/apiheaders'

// Color definitions
const STATUS_COLORS = {
  Completed: getStyle('--cui-success'),
  'In Progress': getStyle('--cui-info'),
  'Not Started': getStyle('--cui-danger'),
  OverDue: getStyle('--cui-warning'),
}

const PRIORITY_COLORS = {
  High: getStyle('--cui-danger'),
  Medium: getStyle('--cui-warning'),
  Low: getStyle('--cui-info'),
}

const FILTER_OPTIONS = ['day', 'week', 'month']

// Helper: Check if all data points are 0
const isChartEmpty = (dataArray = []) => {
  return dataArray.every((value) => value === 0)
}

const MainChart = ({ userId }) => {
  const [statusChart, setStatusChart] = useState(null)
  const [priorityChart, setPriorityChart] = useState(null)
  const [filter, setFilter] = useState('month')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchChartData = async (selectedFilter) => {
    setLoading(true)
    try {
      const res = await axios.get(`${ApiUrl.User}/task-status-chart`, {
        params: { userId, filter: selectedFilter },
      })

      const response = res.data?.data || []

      const statusTotals = { Completed: 0, 'In Progress': 0, 'Not Started': 0, OverDue: 0 }
      const priorityTotals = { High: 0, Medium: 0, Low: 0 }

      response.forEach((entry) => {
        Object.keys(statusTotals).forEach(
          (key) => (statusTotals[key] += entry.statuses?.[key] || 0)
        )
        Object.keys(priorityTotals).forEach(
          (key) => (priorityTotals[key] += entry.severities?.[key] || 0)
        )
      })

      const statusLabels = Object.keys(statusTotals)
      const statusData = statusLabels.map((s) => statusTotals[s])
      const statusColors = statusLabels.map((s) => STATUS_COLORS[s])

      const priorityLabels = Object.keys(priorityTotals)
      const priorityData = priorityLabels.map((s) => priorityTotals[s])
      const priorityColors = priorityLabels.map((s) => PRIORITY_COLORS[s])

      setStatusChart(
        isChartEmpty(statusData)
          ? null
          : {
              labels: statusLabels,
              datasets: [
                { data: statusData, backgroundColor: statusColors, hoverOffset: 8 },
              ],
            }
      )

      setPriorityChart(
        isChartEmpty(priorityData)
          ? null
          : {
              labels: priorityLabels,
              datasets: [
                { data: priorityData, backgroundColor: priorityColors, hoverOffset: 8 },
              ],
            }
      )

      setError('')
    } catch (err) {
      console.error(err)
      setError('Failed to load chart data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChartData(filter)
  }, [filter])

  return (
    <div className="mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div>
          <h5 className="fw-bold mb-1">📊 Task Insights Overview</h5>
          <small className="text-muted">Status & priority distribution ({filter})</small>
        </div>
        <div>
          <select
            className="form-select form-select-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ minWidth: '130px' }}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts or Loading/Error */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <div className="row g-4 overflow-hidden">
          {/* Task Status Chart */}
          <div className="col-12 col-md-6 d-flex flex-column">
            <div className="p-3 border rounded h-100">
              <h6 className="fw-semibold mb-3 text-center">🧮 Task Status Distribution</h6>
              <div
                className="flex-grow-1 d-flex justify-content-center align-items-center"
                style={{ maxHeight: '260px', minHeight: '150px' }}
              >
                {statusChart ? (
                  <CChartPie
                    data={statusChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: getStyle('--cui-body-color'),
                            boxWidth: 16,
                          },
                        },
                      },
                    }}
                    style={{ height: '100%', width: '85%' }}
                  />
                ) : (
                  <p className="text-muted">No data to show in graph</p>
                )}
              </div>
            </div>
          </div>

          {/* Task Priority Chart */}
          <div className="col-12 col-md-6 d-flex flex-column">
            <div className="p-3 border rounded h-100 border-start-md">
              <h6 className="fw-semibold mb-3 text-center">🎯 Task Priority Breakdown</h6>
              <div
                className="flex-grow-1 d-flex justify-content-center align-items-center"
                style={{ maxHeight: '260px', minHeight: '150px' }}
              >
                {priorityChart ? (
                  <CChartPie
                    data={priorityChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: getStyle('--cui-body-color'),
                            boxWidth: 16,
                          },
                        },
                      },
                    }}
                    style={{ height: '100%', width: '85%' }}
                  />
                ) : (
                  <p className="text-muted">No data to show in graph</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainChart
