import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import { AlertProvider } from './contexts/AlertContext'
import { OrderProvider } from './contexts/OrderContext'
import AdminLayout from './layouts/AdminLayout'
import MainLayout from './layouts/MainLayout'
import About from './pages/About'
import AdminActivityLogs from './pages/AdminActivityLogs'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminMenu from './pages/AdminMenu'
import AdminOrders from './pages/AdminOrders'
import AdminRecipes from './pages/AdminRecipes'
import AdminRegister from './pages/AdminRegister'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Order from './pages/Order'
import RecipeDetail from './pages/RecipeDetail'
import Reservation from './pages/Reservation'

const App: React.FC = () => {
  return (
    <AlertProvider>
      <OrderProvider>
        <Router>
          <Routes>
            {/* Public routes with main layout */}
            <Route element={<MainLayout />}>
              <Route path='/' element={<Home />} />
              <Route path='/menu' element={<Menu />} />
              <Route path='/recipe/:id' element={<RecipeDetail />} />
              <Route path='/order' element={<Order />} />
              <Route path='/about' element={<About />} />
              <Route path='/reservation' element={<Reservation />} />
            </Route>

            {/* Admin authentication routes */}
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path='/admin/register' element={<AdminRegister />} />

            {/* Protected admin routes */}
            <Route element={<AdminLayout />}>
              <Route
                path='/admin'
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path='/admin/orders'
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path='/admin/menu'
                element={
                  <AdminRoute>
                    <AdminMenu />
                  </AdminRoute>
                }
              />
              <Route
                path='/admin/recipes'
                element={
                  <AdminRoute>
                    <AdminRecipes />
                  </AdminRoute>
                }
              />
              <Route
                path='/admin/activity'
                element={
                  <AdminRoute>
                    <AdminActivityLogs />
                  </AdminRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </OrderProvider>
    </AlertProvider>
  )
}

export default App
