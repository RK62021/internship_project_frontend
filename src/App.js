import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
import { GetLocalStorage } from './services/localStorageService'
import PublicRoutesLayout from './layout/PublicLayout'
import PrivateRoutesLayout from './layout/PrivateLayout'
import PublicRoutes from './Routes/publicroutes'
import PrivateRoutes from './Routes/privateroutes'
import { ToastContainer } from 'react-toastify'
import Login from './views/pages/login/Login'

const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // console.log(GetLocalStorage('isLogin'))
  // console.log(typeof(GetLocalStorage('isLogin')))

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route element={<PrivateRoutesLayout />}>
          {PrivateRoutes.map((routes,index)=>{
            return(
              <>
            <Route key={index} path={routes.path} element={routes.element} />
            </>
            )
          }
        )}
        </Route>
        <Route element={<PublicRoutesLayout/>}>
        {PublicRoutes.map((routes,index)=>{
            return(
            <Route key={index} path={routes.path} element={routes.element} />
            )
          }
        )}
        </Route>
          <Route path="/*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
