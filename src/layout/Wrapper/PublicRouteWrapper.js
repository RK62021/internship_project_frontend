import React from 'react'
import { Navigate } from 'react-router-dom'
import { GetLocalStorage } from '../../services/localStorageService'

const PublicRouteWrapper = ({ children }) => {
  const isLogin = GetLocalStorage('isLogin') === 'true' || GetLocalStorage('isLogin') === true

  // If logged in, redirect to dashboard (or any private page)
  return isLogin ? <Navigate to="/dashboard" replace /> : children
}

export default PublicRouteWrapper
