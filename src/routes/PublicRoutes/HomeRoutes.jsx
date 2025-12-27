import {Routes, Route} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Landing from '@/Features/Website/landing/Landing';
import OrgSetup from '@/Features/Website/landing/OrgSetup/OrgSetup';
import NotFound from '@/Features/Website/landing/NotFound/NotFound';

export default function HomeRoutes() {
    
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/org-setup" element={<OrgSetup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}