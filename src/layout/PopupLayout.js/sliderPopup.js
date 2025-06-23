import React from 'react'
import { motion } from 'framer-motion'
import { CButton } from '@coreui/react'

const SlideDownPopup = ({ onClose, onConfirm }) => {
  return (
    <>
      {/* Backdrop Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
        style={{ zIndex: 1049 }}
      />

      {/* Sliding Modal */}
      <motion.div
        initial={{ y: '-100vh', opacity: 0 }}      // Starts off-screen at top
        animate={{ y: '20vh', opacity: 1 }}         // Scrolls to visible position
        exit={{ y: '-100vh', opacity: 0 }}          // Scrolls back up
        transition={{
          type: 'tween',        // smoother scroll-like motion
          duration: 0.6,
          ease: 'easeInOut'
        }}
        className="position-fixed start-50 translate-middle-x bg-white shadow-lg p-4 rounded border"
        style={{
          zIndex: 1050,
          top: 0,
          width: '80%',
          maxWidth: '500px',
        }}
      >
        <h5 className="mb-3 text-danger">⚠️ Confirm Delete</h5>
        <p>This action is irreversible. Do you really want to delete this item?</p>
        <div className="d-flex justify-content-end gap-2">
          <CButton color="secondary" variant="outline" onClick={onClose}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={onConfirm}>
            Yes, Delete
          </CButton>
        </div>
      </motion.div>
    </>
  )
}

export default SlideDownPopup
