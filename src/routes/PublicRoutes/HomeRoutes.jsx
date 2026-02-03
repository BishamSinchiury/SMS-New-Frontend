import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PublicHome from '@/pages/PublicHome';
import Landing from '@/Features/Website/landing/Landing';
import OrgSetup from '@/Features/Website/landing/OrgSetup/OrgSetup';
import NotFound from '@/Features/Website/landing/NotFound/NotFound';
import ProfileSetup from '@/pages/Auth/ProfileSetup';
import StatusPage from '@/pages/Auth/StatusPage';

import ProtectedRoute from '@/routes/ProtectedRoute';
import Dashboard from '@/Features/Core/Dashboard/Dashboard';

export default function HomeRoutes() {

  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<Landing />} />
      <Route path="/org-setup" element={<OrgSetup />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/status" element={<StatusPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}