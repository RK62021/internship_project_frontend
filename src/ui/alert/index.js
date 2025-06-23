import React from 'react'
import { CAlert, CButton } from '@coreui/react'

const AlertBox = ({ onConfirm, onCancel }) => {
  return (
    <CAlert color="danger" className="d-flex justify-content-between align-items-center">
      <div>
        <strong>Warning!</strong> Are you sure you want to delete this item? This action cannot be undone.
      </div>
      <div>
        <CButton color="light" variant="outline" size="sm" className="me-2" onClick={onCancel}>
          Cancel
        </CButton>
        <CButton color="danger" size="sm" onClick={onConfirm}>
          Yes, Delete
        </CButton>
      </div>
    </CAlert>
  )
}

export default AlertBox
