import { useState } from 'react'

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './routes/Login'
import Userdashboard from './routes/Userdashboard'
import { ProtectedRoute } from './authRoutes/ProtectedRoute'

import Register from './routes/Register'
import AdminDashboard from './routes/AdminDashboard'

function App() {


  return (
  <>
  <Routes>

  {/* PUBLIC ROUTES */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* USER ROUTES */}
  <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
            <Userdashboard />
        </ProtectedRoute>
      } 
  />

 

  {/* ADMIN ROUTES */}
  <Route 
      path="/admin/dashboard" 
      element={
        <ProtectedRoute>

            <AdminDashboard />

        </ProtectedRoute>
      } 
  />

  {/* <Route 
      path="/admin/jobs" 
      element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminJobs />
          </AdminRoute>
        </ProtectedRoute>
      } 
  /> */}

</Routes>

  </>
  )
}

export default App
