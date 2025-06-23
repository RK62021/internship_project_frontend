import React, { useState } from 'react'
import {
  CToast, CToastBody, CToastClose, CToaster, CButton
} from '@coreui/react'

const NotificationButton = () => {
  const [toasts, setToasts] = useState([])

  const showToast = () => {
    setToasts((prev) => [
      ...prev,
      <CToast key={Date.now()} visible color="success" className="text-white">
        <div className="d-flex">
          <CToastBody>Success message!</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    ])
  }

  return (
    <>
      <CButton color="success" onClick={showToast}>Show Toast</CButton>
      <CToaster position="top-end">{toasts}</CToaster>
    </>
  )
}
