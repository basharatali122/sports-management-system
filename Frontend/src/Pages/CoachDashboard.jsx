import React, { useContext } from 'react';
import Sidebar from "../Components/CoachComponents/Sidebar.jsx";
import Dashboard from '../Components/CoachComponents/Dashboard.jsx';
import { ThemeContext } from '../context/ThemeContext.js';
import mainBg from '../assets/Main_Bg.jpg'; 
import { Outlet } from 'react-router-dom';


function CoachDashboard() {
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === 'dark';

  const mainBg = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const sidebarBg = isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';

  return (
    <div className="relative min-h-screen">
            
    <div className={`flex w-full min-h-screen  ${mainBg} transition-colors duration-500`}>
      
      {/* Sidebar */}
      <div className={`w-64 shadow-md ${sidebarBg} transition-colors duration-500`}>
        <Sidebar />
      </div>
      <Outlet />
    </div>
    </div>
  );
}

export default CoachDashboard;
