/**
 * API Services Barrel Export
 * 
 * Centralized export for all services to allow for cleaner imports.
 * 
 * @example
 * import { authService, userService } from '@/services';
 */

import apiClient, { apiMethods } from './apiClient';
import authService from './authService';
import userService from './userService';
import orgService from './orgService';

export {
    apiClient,
    apiMethods,
    authService,
    userService,
    orgService
};

/**
 * How to add a new service:
 * 1. Create a new service file (e.g., exampleService.js)
 * 2. Define the API functions using apiMethods
 * 3. Import and export it here
 */
