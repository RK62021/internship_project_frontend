import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CAvatar,
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import './styles/style.css'
const userAvatars = [
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
]

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const storedUser = useSelector((state) => state.userType)
  const Username = useSelector((state) => state.userName)
  console.log('stored theme in login----------', storedUser)
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      // colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader style={{ background: 'white', height: '10px' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url("https://static.wixstatic.com/media/63c3c7_70b1690eb37b4d5e96fcdfbab6985fc6~mv2.png/v1/fill/w_344,h_116,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/LOGO-1.png")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            padding: '26px 0px'
          }}
        >
           
        </div>
       

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      {/* <div className="px-3 py-2 d-flex align-items-center">
        <CAvatar
          src={userAvatars[0]}
          color="primary"
          size="lg"
          textColor="white"
          className="me-3"
        />
        <div>
          <p className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>
            {Username}
          </p>
          <p className="mb-0 text-muted text-capitalize" style={{ fontSize: '12px' }}>
            {storedUser}
          </p>
        </div>
      </div> */}

      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
