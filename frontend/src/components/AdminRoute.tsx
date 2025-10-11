import React from 'react'
import { Navigate } from 'react-router-dom'

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminData = localStorage.getItem('admin')

  if (!adminData) {
    return <Navigate to='/admin/login' replace />
  }

  try {
    const parsed = JSON.parse(adminData)
    const token = parsed.token
    return token ? <>{children}</> : <Navigate to='/admin/login' replace />
  } catch (error) {
    // If there's an error parsing the admin data, redirect to login
    return <Navigate to='/admin/login' replace />
  }
}

export default AdminRoute
