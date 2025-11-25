
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './routes/Login'
import Userdashboard from './routes/Userdashboard'
import { ProtectedRoute } from './authRoutes/ProtectedRoute'

import Register from './routes/Register'
import AdminDashboard from './routes/AdminDashboard'
import Navbar from './components/Navbar'
import { LoggedRoute } from './authRoutes/LoggedRoute'

function App() {
  const location = useLocation();
 const hideNavbarPaths = ["/login", "/register" , "/"];
   const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
  <>
{!hideNavbar && <Navbar />}
  <Routes>

  {/* PUBLIC ROUTES */}
  <Route path="/login" element={
    <LoggedRoute>
      <Login />
    </LoggedRoute>
    } />

  <Route path="/" element={
    <LoggedRoute>
      <Login />
    </LoggedRoute>
  } />
  <Route path="/register" element={
    <LoggedRoute>
      <Register />
    </LoggedRoute>
  } />

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



</Routes>

  </>
  )
}

export default App
