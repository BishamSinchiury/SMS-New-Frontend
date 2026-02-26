/**
 * Application Route Constants
 * 
 * Centralized route path definitions to avoid hardcoding paths throughout the app.
 * Import and use these constants instead of string literals.
 * 
 * @example
 * import { ROUTES } from '@/constants/routes';
 * navigate(ROUTES.DASHBOARD);
 */

export const ROUTES = {
    // Public Routes
    HOME: '/',
    LOGIN: '/login',
    SYSTEM_ADMIN_LOGIN: '/system-admin/login',
    SIGNUP: '/signup',
    ABOUT: '/about',
    CONTACT: '/contact',

    // Private Routes
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    PROFILE_SETUP: '/profile-setup',
    SETTINGS: '/settings',

    // Admin Routes
    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_ORG_PROFILE: '/admin/profile',
    ADMIN_SETTINGS: '/admin/settings',

    // School Management User Routes
    USER_DASHBOARD: '/dashboard',
    USER_STUDENTS: '/dashboard/students',
    USER_TEACHERS: '/dashboard/teachers',
    USER_FACULTIES: '/dashboard/faculties',
    USER_COURSES: '/dashboard/courses',
    USER_CLASSES: '/dashboard/classes',
    USER_BATCHES: '/dashboard/batches',
    USER_SECTIONS: '/dashboard/sections',
    USER_SUBJECTS: '/dashboard/subjects',
    USER_ATTENDANCE: '/dashboard/attendance',
    USER_EXAMS: '/dashboard/exams',
    USER_TIMETABLE: '/dashboard/timetable',
    USER_FEES: '/dashboard/fees',
    USER_NOTICES: '/dashboard/notices',
    USER_ASSIGNMENTS: '/dashboard/assignments',
    USER_ENROLLMENTS: '/dashboard/enrollments',
    USER_TEACHER_ASSIGNMENTS: '/dashboard/teacher-assignments',
    USER_REPORTS: '/dashboard/reports',
    USER_SETTINGS: '/dashboard/settings',
    USER_PROFILE: '/dashboard/profile',

    // Error Routes
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '*',
};

/**
 * Route Groups for easier management
 */
export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
];

export const USER_ROUTES = [
    ROUTES.USER_DASHBOARD,
    ROUTES.USER_STUDENTS,
    ROUTES.USER_TEACHERS,
    ROUTES.USER_FACULTIES,
    ROUTES.USER_COURSES,
    ROUTES.USER_CLASSES,
    ROUTES.USER_BATCHES,
    ROUTES.USER_SECTIONS,
    ROUTES.USER_SUBJECTS,
    ROUTES.USER_ATTENDANCE,
    ROUTES.USER_EXAMS,
    ROUTES.USER_TIMETABLE,
    ROUTES.USER_FEES,
    ROUTES.USER_NOTICES,
    ROUTES.USER_ASSIGNMENTS,
    ROUTES.USER_ENROLLMENTS,
    ROUTES.USER_TEACHER_ASSIGNMENTS,
    ROUTES.USER_REPORTS,
    ROUTES.USER_SETTINGS,
    ROUTES.USER_PROFILE,
];

export const ADMIN_ROUTES = [
    ROUTES.ADMIN,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_ORG_PROFILE,
    ROUTES.ADMIN_SETTINGS,
];

/**
 * Check if a path is a public route
 */
export const isPublicRoute = (path) => {
    return PUBLIC_ROUTES.includes(path);
};

/**
 * Check if a path is a private route
 */
export const isPrivateRoute = (path) => {
    return PRIVATE_ROUTES.includes(path);
};

/**
 * Check if a path is an admin route
 */
export const isAdminRoute = (path) => {
    return path.startsWith(ROUTES.ADMIN);
};
