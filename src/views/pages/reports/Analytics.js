import React, { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  PieController,
  LineController,
  BarController
} from 'chart.js'
import axios from 'axios'
import ApiUrl from '../../../services/apiheaders'
import { toast } from 'react-toastify'

// Register all required controllers and elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  PieController,
  LineController,
  BarController
)

const Analytics = () => {
  const pieRef = useRef(null)
  const lineRef = useRef(null)
  const barRef = useRef(null)

  const pieChart = useRef(null)
  const lineChart = useRef(null)
  const barChart = useRef(null)

  const [statusData, setStatusData] = useState(null)
  const [trendData, setTrendData] = useState(null)
  const [teamData, setTeamData] = useState(null)

  useEffect(() => {
    fetchCharts()
  }, [])

  useEffect(() => {
    if (statusData) renderPieChart()
    if (trendData) renderLineChart()
    if (teamData) renderBarChart()
  }, [statusData, trendData, teamData])

  const fetchCharts = async () => {
    try {
      const [statusRes, trendRes, teamRes] = await Promise.all([
        axios.get(`${ApiUrl.User}/status-summary`),
        axios.get(`${ApiUrl.User}/task-trend?range=7d`),
        axios.get(`${ApiUrl.User}/team-tasks`)
      ])

      if (statusRes.data.statusCode === 200) setStatusData(statusRes.data.data)
      if (trendRes.data.statusCode === 200) setTrendData(trendRes.data.data)
      if (teamRes.data.statusCode === 200) setTeamData(teamRes.data.data)
    } catch (err) {
      toast.error('Failed to fetch analytics data')
      console.error(err)
    }
  }

  const renderPieChart = () => {
    if (pieChart.current) pieChart.current.destroy()

    const labels = Object.keys(statusData)
    const values = Object.values(statusData)

    const statusColors = {
      'Not Started': '#ffc107',
      'In Progress': '#0d6efd',
      'Completed': '#28a745',
      'Discarded': '#dc3545',
      'OverDue': '#fd7e14',
      'Unknown': '#6c757d'
    }

    const backgroundColor = labels.map(label => statusColors[label] || statusColors.Unknown)

    pieChart.current = new ChartJS(pieRef.current, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Task Status',
          data: values,
          backgroundColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    })
  }

  const renderLineChart = () => {
    if (lineChart.current) lineChart.current.destroy()

    lineChart.current = new ChartJS(lineRef.current, {
      type: 'line',
      data: {
        labels: trendData.map(d => d.date),
        datasets: [{
          label: 'Tasks Created',
          data: trendData.map(d => d.count),
          fill: false,
          borderColor: '#0d6efd',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    })
  }

  const renderBarChart = () => {
    if (barChart.current) barChart.current.destroy()

    const labels = teamData.map(t => t.teamName)

    const allStatuses = ['Completed', 'In Progress', 'Not Started', 'Discarded', 'OverDue']
    const statusColors = {
      'Completed': '#28a745',
      'In Progress': '#0d6efd',
      'Not Started': '#ffc107',
      'Discarded': '#dc3545',
      'OverDue': '#fd7e14'
    }

    const datasets = allStatuses.map(status => ({
      label: status,
      data: teamData.map(t => t[status] || 0),
      backgroundColor: statusColors[status] || '#6c757d'
    }))

    barChart.current = new ChartJS(barRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    })
  }

  return (
    <div className="py-4 px-3">
      <h4 className="fw-bold mb-4 text-center">📊 Task Analytics Dashboard</h4>

      <div className="row g-4">
        {/* Pie Chart */}
        <div className="col-md-6 col-sm-12">
          <div className="border rounded p-3 bg-white shadow-sm h-100">
            <h6 className="text-center mb-3">Task Status Overview</h6>
            <div style={{ height: '300px' }}>
              <canvas ref={pieRef}></canvas>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="col-md-6 col-sm-12">
          <div className="border rounded p-3 bg-white shadow-sm h-100">
            <h6 className="text-center mb-3">Tasks Created (Last 7 Days)</h6>
            <div style={{ height: '300px' }}>
              <canvas ref={lineRef}></canvas>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-12">
          <div className="border rounded p-3 bg-white shadow-sm">
            <h6 className="text-center mb-3">Team-wise Task Completion</h6>
            <div style={{ height: '400px' }}>
              <canvas ref={barRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
