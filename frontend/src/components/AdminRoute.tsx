import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAdmin } from '../services/auth.service'

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if user is admin using our service
  const isAuthenticated = isAdmin()

  return isAuthenticated ? <>{children}</> : <Navigate to='/admin/login' replace />
}

export default AdminRoute
