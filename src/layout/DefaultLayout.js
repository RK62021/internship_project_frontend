import React, { Suspense } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
         

        <div className="body flex-grow-1 px-4">
        <ToastContainer/>
          <Outlet />
        </div>

        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
