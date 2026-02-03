/**
 * Redirect Engine
 * 
 * Centralized logic for determining where a user should go based on their state.
 * Returns the target path string, or null if no redirect is needed (i.e., current path is valid).
 */

export const getRedirectTarget = (user, currentPath) => {
    // 1. Not Authenticated
    if (!user) {
        // If trying to access a protected route, send to Login
        // Public routes should use PublicRoute wrapper to handle inverse logic
        return '/';
    }

    // 2. Organization Checks
    const hasOrg = user.person && user.person.organization;

    // 2.1 No Organization -> Create/Join
    if (!hasOrg) {
        // Allow access to org creation wizard
        if (currentPath === '/org/create' || currentPath === '/org-setup') {
            return null; // Stay here
        }
        return '/org-setup';
    }

    // 2.2 Organization Exists, but Profile Incomplete
    // TODO: Add 'is_profile_complete' flag to Organization model or logic here
    const isOrgSetupComplete = true; // Placeholder: Assume complete for now
    if (!isOrgSetupComplete) {
        if (currentPath === '/org/profile/setup') {
            return null;
        }
        return '/org/profile/setup';
    }

    // 3. Authenticated & Org Ready -> Dashboard Logic

    // If user is on a "guest" page (like login), send them to dashboard
    if (currentPath === '/' || currentPath === '/login') {
        return '/dashboard'; // Main dashboard dispatcher
    }

    // 4. Role-Based Redirects (Optional Specificity)
    // If accessing generic /dashboard, we can allow it or refine to /dashboard/role

    return null; // No redirect needed, user is allowed to be here
};

/**
 * Helper to check if user has specific permission/role
 */
export const checkRoleAccess = (user, allowedRoles) => {
    if (!user || !user.role) return false;
    if (allowedRoles.length === 0) return true; // No specific roles required
    return allowedRoles.includes(user.role);
};
