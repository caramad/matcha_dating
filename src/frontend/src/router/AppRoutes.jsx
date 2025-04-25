import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import HomeRoutes from '@/features/home/routes';
import AuthRoutes from '@/features/auth/routes';
import ProfileRoutes from '@/features/profile/routes';
import InterestsRoutes from '@/features/interests/routes';
import AppLayoutRoutes from '@/features/appLayout/routes';


function AppRoutes() {
  return (
    <Router>
      <Routes>
        {HomeRoutes}
        {AuthRoutes}
        {ProfileRoutes}
        {InterestsRoutes}
        {AppLayoutRoutes}
      </Routes>
    </Router>
  )
}

export default AppRoutes;
