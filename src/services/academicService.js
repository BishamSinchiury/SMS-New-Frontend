import { apiMethods } from './apiClient';

/**
 * Academic Service
 * 
 * Handles all API calls related to the academic module.
 */
// Helper to normalize DRF paginated vs simple list responses
const normalize = (res) => Array.isArray(res) ? res : (res.results || []);

const academicService = {
    // Faculties
    getFaculties: async () => normalize(await apiMethods.get('/academic/faculties/')),
    createFaculty: (data) => apiMethods.post('/academic/faculties/', data),
    updateFaculty: (id, data) => apiMethods.put(`/academic/faculties/${id}/`, data),
    deleteFaculty: (id) => apiMethods.delete(`/academic/faculties/${id}/`),

    // Classes
    getClasses: async () => normalize(await apiMethods.get('/academic/classes/')),
    createClass: (data) => apiMethods.post('/academic/classes/', data),
    updateClass: (id, data) => apiMethods.put(`/academic/classes/${id}/`, data),
    deleteClass: (id) => apiMethods.delete(`/academic/classes/${id}/`),

    // Courses
    getCourses: async () => normalize(await apiMethods.get('/academic/courses/')),
    createCourse: (data) => apiMethods.post('/academic/courses/', data),
    updateCourse: (id, data) => apiMethods.put(`/academic/courses/${id}/`, data),
    deleteCourse: (id) => apiMethods.delete(`/academic/courses/${id}/`),

    // Subjects
    getSubjects: async () => normalize(await apiMethods.get('/academic/subjects/')),
    createSubject: (data) => apiMethods.post('/academic/subjects/', data),
    updateSubject: (id, data) => apiMethods.put(`/academic/subjects/${id}/`, data),
    deleteSubject: (id) => apiMethods.delete(`/academic/subjects/${id}/`),

    // Batches
    getBatches: async () => normalize(await apiMethods.get('/academic/batches/')),
    createBatch: (data) => apiMethods.post('/academic/batches/', data),
    updateBatch: (id, data) => apiMethods.put(`/academic/batches/${id}/`, data),
    deleteBatch: (id) => apiMethods.delete(`/academic/batches/${id}/`),

    // Sections
    getSections: async () => normalize(await apiMethods.get('/academic/sections/')),
    createSection: (data) => apiMethods.post('/academic/sections/', data),
    updateSection: (id, data) => apiMethods.put(`/academic/sections/${id}/`, data),
    deleteSection: (id) => apiMethods.delete(`/academic/sections/${id}/`),

    // Enrollments
    getEnrollments: async () => normalize(await apiMethods.get('/academic/enrollments/')),
    createEnrollment: (data) => apiMethods.post('/academic/enrollments/', data),

    // Teacher Assignments
    getTeacherAssignments: async () => normalize(await apiMethods.get('/academic/assignments/')),
    createTeacherAssignment: (data) => apiMethods.post('/academic/assignments/', data),
    deleteTeacherAssignment: (id) => apiMethods.delete(`/academic/assignments/${id}/`),

    // Enrollments (full CRUD)
    deleteEnrollment: (id) => apiMethods.delete(`/academic/enrollments/${id}/`),

    // People
    getStudents: async () => normalize(await apiMethods.get('/people/persons/?person_type=STUDENT')),
    getTeachers: async () => normalize(await apiMethods.get('/people/persons/?person_type=TEACHER')),
};

export default academicService;
