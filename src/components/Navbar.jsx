import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NotificationBell from './NotificationBell'
import { useNavigate } from 'react-router-dom';


const Navbar = ({ onLogout }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const raw = localStorage.getItem('User')
    try {
      const user = raw ? JSON.parse(raw) : null
      if (user && user.name) setName(user.name)
    } catch (e) {}
  }, [])


 
 
 



  const handleLogout = async () => {
    try {
      await axios.post(`http://localhost:8080/api/auth/logout`, {}, { withCredentials: true })
    } catch (e) {
      console.debug('Logout failed', e?.message || e)
    }
    localStorage.removeItem('User')
    localStorage.removeItem('token')
    localStorage.removeItem('notifications')
    navigate('/login');
  }


  

  return (
    <header className="flex justify-between items-center px-4 py-3 border-b bg-white sticky top-0 z-50">
      <div className="text-2xl  font-bold font-serif ">Hi <span      
 >👋</span>, <span className='text-3xl font-sans'>{name} </span> </div>


        <h1 className='text-2xl font-bold  px-4 text-blue-500 '>ShelfEx - Job Management</h1>
      <div className="flex items-center gap-3">
        <div aria-label="notifications" title="Notifications" className="p-1 rounded-md hover:bg-gray-100">
          <NotificationBell />
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-600">Logout</button>
      </div>
    </header>
  )
}

export default Navbar

