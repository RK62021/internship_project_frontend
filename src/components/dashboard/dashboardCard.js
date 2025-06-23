import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {  cilOptions } from '@coreui/icons'

const DashboardCard = ({data}) => {

  return (

<CWidgetStatsA
  className="mb-4 d-flex justify-content-center align-items-center"
  color={data.color}
  value={
    <div
      style={{
        display: 'flex',
        padding:'0px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Ensures full vertical space is used
        minHeight: '100px', // Optional: adjust based on widget height
      }}
    >
      <div style={{ fontSize: '28px', fontWeight: '600' }}>{data.count}</div>
      <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>{data.name.toUpperCase()}</div>
    </div>
  }
/>


  
  )
}

export default DashboardCard
