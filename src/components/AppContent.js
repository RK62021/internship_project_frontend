import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
// import  routes from '../routesppp'
import PrivateRoutes from '../Routes/privateroutes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {PrivateRoutes.map((route, idx) => {
              return (
               <Route key={idx} path={route.path} element={route.element} />
              )
            })}
          </Routes>
        </Suspense>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
