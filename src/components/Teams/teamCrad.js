import {
    CWidgetStatsA,
  } from '@coreui/react'
  import { FaLaptopCode, FaTruck, FaUsers, FaClipboardList } from 'react-icons/fa'
  import { Color } from '../../utils/data'
  
  const departmentIcons = {
    IT: <FaLaptopCode size={24} />,
    Logistics: <FaTruck size={24} />,
    HR: <FaUsers size={24} />,
    Admin: <FaClipboardList size={24} />,
  }

  const userAvatars = [
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
  ]
  // const AvatarGroup = ({ avatars, max = 4 }) => {
  //   const displayedAvatars = avatars.slice(0, max)
  //   const extraCount = avatars.length - max
  
  //   return (
  //     <div style={{ display: 'flex', alignItems: 'center' }}>
  //       {displayedAvatars.map((src, index) => (
  //         <img
  //           key={index}
  //           src={src}
  //           alt={`avatar-${index}`}
  //           style={{
  //             width: '32px',
  //             height: '32px',
  //             borderRadius: '50%',
  //             objectFit: 'cover',
  //             border: '2px solid white',
  //             marginLeft: index === 0 ? 0 : -10,
  //             zIndex: avatars.length - index,
  //           }}
  //         />
  //       ))}
  //       {extraCount > 0 && (
  //         <div
  //           style={{
  //             width: '32px',
  //             height: '32px',
  //             borderRadius: '50%',
  //             backgroundColor: '#6c757d',
  //             color: 'white',
  //             display: 'flex',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             fontSize: '0.8rem',
  //             fontWeight: 'bold',
  //             marginLeft: -10,
  //             zIndex: 0,
  //             border: '2px solid white',
  //           }}
  //         >
  //           +{extraCount}
  //         </div>
  //       )}
  //     </div>
  //   )
  // }
  
  const TeamCard = ({ data, index }) => {
    const icon = departmentIcons[data.name] || <FaUsers size={24} />
  
    return (
      <CWidgetStatsA
        color="white"
        height={50}
        value={
          <div style={{ textAlign: 'left' }}>
            <div className="" style={{color:"black"}}>
              <div>{icon}</div>
              <strong>{data.name}</strong>
            </div>
            <div>
              5 Members
            </div>
          </div>
        }
      />
    )
  }

  
  export default TeamCard;