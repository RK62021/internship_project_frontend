import React from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CAvatar,
  CBadge,
  CTooltip,
} from '@coreui/react'

const userAvatars = [
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
]

const AvatarGroup = ({ avatars }) => (
  <div className="d-flex align-items-center gap-1">
    {avatars.map((url, idx) => (
      <CTooltip content={`User ${idx + 1}`} key={idx}>
        <CAvatar
          src={url}
          size="sm"
          style={{ border: '2px solid #fff', boxShadow: '0 0 3px rgba(0,0,0,0.2)' }}
        />
      </CTooltip>
    ))}
  </div>
)

const UserCardWithColor = ({
  taskName = 'Frontend Dashboard UI',
  taskDesc = 'Build responsive dashboard UI with charts and user widgets.',
  assignedDate = '2025-05-01',
  completionDate = '2025-05-15',
  status = 'Complete',
}) => {
  const statusColor = status === 'Complete' ? 'success' : 'danger'

  return (
    <CCard className="shadow-sm border-0 rounded-3">
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <CCardTitle className="h5">{taskName}</CCardTitle>
          <CBadge color={statusColor}>{status}</CBadge>
        </div>

        <CCardText className="mb-3 text-muted">{taskDesc}</CCardText>

        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <small className="text-muted">Assigned To:</small>
            <AvatarGroup avatars={userAvatars} />
          </div>
          <div className="text-end">
            <div>
              <small className="text-muted">Assigned Date:</small>
              <div>{assignedDate}</div>
            </div>
            <div>
              <small className="text-muted">Completion Date:</small>
              <div>{completionDate}</div>
            </div>
          </div>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default UserCardWithColor
