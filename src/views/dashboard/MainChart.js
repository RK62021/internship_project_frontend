import React, { useEffect, useState } from 'react'
import { CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import axios from 'axios'
import ApiUrl from '../../services/apiheaders' // adjust path to your service file

const STATUS_COLORS = {
  Completed: getStyle('--cui-success'),
  'In Progress': getStyle('--cui-info'),
  'Not Started': getStyle('--cui-danger'),
  OverDue: getStyle('--cui-warning'),
}

const FILTER_OPTIONS = ['day', 'week', 'month']

const MainChart = ({ userId }) => {
  const [labels, setLabels] = useState([])
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('month') // default
  const [error, setError] = useState('')

  const fetchChartData = async (selectedFilter) => {
    setLoading(true)
    try {
      const res = await axios.get(`${ApiUrl.User}/task-status-chart`, {
        params: {
          userId,
          filter: selectedFilter,
        },
      })

      const response = res.data?.data || []

      const tempLabels = []
      const statusMap = {
        Completed: [],
        'In Progress': [],
        'Not Started': [],
        OverDue: [],
      }

      response.forEach((entry) => {
        tempLabels.push(entry.label)
        Object.keys(statusMap).forEach((status) => {
          statusMap[status].push(entry.statuses[status] || 0)
        })
      })

      const chartDatasets = Object.entries(statusMap).map(([status, data]) => ({
        label: status,
        backgroundColor: STATUS_COLORS[status],
        data,
        barPercentage: 0.8,
        categoryPercentage: 0.6,
      }))

      setLabels(tempLabels)
      setDatasets(chartDatasets)
      setError('')
    } catch (err) {
      console.error(err)
      setError('Failed to load chart data')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchChartData(filter)
  }, [filter])

  return (
    <CCard className="mb-4">
      <CCardBody>
        <CRow className="mb-3">
          <CCol>
            <h5 style={{ fontWeight: 'bold' }}>Task Status Overview</h5>
          </CCol>
          <CCol className="text-end" xs="auto">
            <CFormSelect
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: '150px', display: 'inline-block' }}
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <CChartBar
            style={{ height: '350px' }}
            data={{
              labels,
              datasets,
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    color: getStyle('--cui-body-color'),
                  },
                },
                title: {
                  display: true,
                  text:
                    filter === 'day'
                      ? 'Today\'s Task Status'
                      : filter === 'week'
                      ? 'Task Status Over the Week'
                      : 'Task Status Over the Last 6 Months',
                  color: getStyle('--cui-body-color'),
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                },
              },
              scales: {
                x: {
                  stacked: true,
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                },
              },
            }}
          />
        )}
      </CCardBody>
    </CCard>
  )
}

export default MainChart
