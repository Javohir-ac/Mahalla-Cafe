import React from 'react'
import { Navigate } from 'react-router-dom'
<<<<<<< HEAD
import { isAdmin } from '../services/auth.service'

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if user is admin using our service
  const isAuthenticated = isAdmin()

  return isAuthenticated ? <>{children}</> : <Navigate to='/admin/login' replace />
=======

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('adminToken')

  // In a real application, you would also verify the token with the backend
  // For now, we're just checking if the token exists
  return token ? <>{children}</> : <Navigate to='/admin/login' replace />
>>>>>>> 4644f719855ad091e7d31f14a3af7713558a7c4b
}

export default AdminRoute
