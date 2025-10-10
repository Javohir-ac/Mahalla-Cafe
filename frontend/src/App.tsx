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