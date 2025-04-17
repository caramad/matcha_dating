import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import HomeRoutes from '@/features/home/routes';
import AuthRoutes from '@/features/auth/routes';


function AppRoutes() {
  return (
    <Router>
      <Routes>
        {HomeRoutes}
		{AuthRoutes}
      </Routes>
    </Router>
  )
}

export default AppRoutes
