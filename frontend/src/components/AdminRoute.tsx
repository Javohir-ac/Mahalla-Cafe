import React from 'react'
import { Navigate } from 'react-router-dom'

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('adminToken')

  // In a real application, you would also verify the token with the backend
  // For now, we're just checking if the token exists
  return token ? <>{children}</> : <Navigate to='/admin/login' replace />
}

export default AdminRoute
