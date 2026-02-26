import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

// Public Pages
import Home from '@/pages/public/Home';
import Login from '@/pages/public/Login';
import SignUp from '@/pages/public/SignUp';
import SystemAdminLogin from '@/pages/public/SystemAdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import OrganizationProfile from '@/pages/admin/OrganizationProfile';
import UserManagement from '@/pages/admin/UserManagement';
import UserDashboard from '@/pages/user/UserDashboard';
import ProfilePage from '@/pages/user/Profile';
// Student Management
import StudentManagement from '@/pages/user/students/StudentManagement';
// Academic Pages
import FacultyManagement from '@/pages/user/academic/FacultyManagement';
import CourseManagement from '@/pages/user/academic/CourseManagement';
import ClassManagement from '@/pages/user/academic/ClassManagement';
import SubjectManagement from '@/pages/user/academic/SubjectManagement';
import BatchManagement from '@/pages/user/academic/BatchManagement';
import SectionManagement from '@/pages/user/academic/SectionManagement';
import StudentEnrollment from '@/pages/user/academic/StudentEnrollment';
import TeacherAssignment from '@/pages/user/academic/TeacherAssignment';


import { ROUTES } from '@/constants/routes';

/**
 * AppRoutes Component
 * 
 * Central routing configuration for the application.
 * Organized into Public and Private route sections.
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}

            {/* Home Page - Base URL */}
            <Route
                path={ROUTES.HOME}
                element={
                    <PublicRoute>
                        <Home />
                    </PublicRoute>
                }
            />

            {/* Login Page - Restricted (authenticated users redirected) */}
            <Route
                path={ROUTES.LOGIN}
                element={
                    <PublicRoute restricted={true}>
                        <Login />
                    </PublicRoute>
                }
            />

            {/* System Admin Login Page */}
            <Route
                path={ROUTES.SYSTEM_ADMIN_LOGIN}
                element={
                    <PublicRoute restricted={true}>
                        <SystemAdminLogin />
                    </PublicRoute>
                }
            />

            {/* Sign Up Page - Restricted (authenticated users redirected) */}
            <Route
                path={ROUTES.SIGNUP}
                element={
                    <PublicRoute restricted={true}>
                        <SignUp />
                    </PublicRoute>
                }
            />

            {/* About Page */}
            <Route
                path="/about"
                element={
                    <PublicRoute>
                        <div>About Page (To be implemented)</div>
                    </PublicRoute>
                }
            />

            {/* Contact Page */}
            <Route
                path="/contact"
                element={
                    <PublicRoute>
                        <div>Contact Page (To be implemented)</div>
                    </PublicRoute>
                }
            />


            {/* ==================== PRIVATE ROUTES ==================== */}

            {/* General User Dashboard - Restricted to USER or STAFF */}
            <Route
                path={ROUTES.USER_DASHBOARD}
                element={
                    <PrivateRoute allowedRoles={['USER', 'STAFF', 'ADMIN', 'TEACHER', 'ACCOUNTANT']}>
                        <UserDashboard />
                    </PrivateRoute>
                }
            />

            {/* Student Management */}
            <Route
                path={ROUTES.USER_STUDENTS}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'TEACHER']}>
                        <StudentManagement />
                    </PrivateRoute>
                }
            />

            {/* Academic Management - Restricted to Admins, Staff and Teachers */}

            <Route
                path={ROUTES.USER_FACULTIES}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'TEACHER']}>
                        <FacultyManagement />
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_COURSES}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'TEACHER']}>
                        <CourseManagement />
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_CLASSES}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'TEACHER']}>
                        <ClassManagement />
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_BATCHES}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'TEACHER']}>
                        <BatchManagement />
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_SECTIONS}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'TEACHER']}>
                        <SectionManagement />
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_SUBJECTS}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF', 'TEACHER']}>
                        <SubjectManagement />
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_ENROLLMENTS}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF']}>
                        <StudentEnrollment />
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_TEACHER_ASSIGNMENTS}
                element={
                    <PrivateRoute allowedRoles={['ADMIN', 'STAFF']}>
                        <TeacherAssignment />
                    </PrivateRoute>
                }
            />

            {/* Profile Page - Requires Authentication */}
            <Route
                path={ROUTES.USER_PROFILE}
                element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                }
            />

            {/* Profile Setup - Post Verification */}

            {/* Settings Page - Requires Authentication */}
            <Route
                path={ROUTES.USER_SETTINGS}
                element={
                    <PrivateRoute>
                        <div>Settings Page (To be implemented)</div>
                    </PrivateRoute>
                }
            />

            {/* Admin Routes - Strictly Restricted to ADMIN Role */}
            <Route
                path={ROUTES.ADMIN}
                element={
                    <PrivateRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </PrivateRoute>
                }
            />

            <Route
                path={ROUTES.ADMIN_USERS}
                element={
                    <PrivateRoute allowedRoles={['ADMIN']}>
                        <UserManagement />
                    </PrivateRoute>
                }
            />

            <Route
                path={ROUTES.ADMIN_ORG_PROFILE}
                element={
                    <PrivateRoute allowedRoles={['ADMIN']}>
                        <OrganizationProfile />
                    </PrivateRoute>
                }
            />


            {/* ==================== ERROR ROUTES ==================== */}

            {/* Unauthorized Access */}
            <Route
                path="/unauthorized"
                element={
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h1>403 - Forbidden</h1>
                        <p>You do not have permission to access this section.</p>
                        <button onClick={() => window.history.back()}>Go Back</button>
                    </div>
                }
            />

            {/* 404 Not Found */}
            <Route
                path="*"
                element={<div>404 - Page Not Found</div>}
            />
        </Routes>
    );
};

export default AppRoutes;
