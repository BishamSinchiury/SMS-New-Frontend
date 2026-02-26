import { apiMethods } from './apiClient';

const normalize = (res) => Array.isArray(res) ? res : (res.results || []);

const peopleService = {
    // --- Generic Person CRUD ---
    getPersons: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return normalize(await apiMethods.get(`/people/persons/${query ? '?' + query : ''}`));
    },
    getPerson: (id) => apiMethods.get(`/people/persons/${id}/`),
    createPerson: (data) => apiMethods.post('/people/persons/', data),
    updatePerson: (id, data) => apiMethods.put(`/people/persons/${id}/`, data),
    patchPerson: (id, data) => apiMethods.patch(`/people/persons/${id}/`, data),
    deletePerson: (id) => apiMethods.delete(`/people/persons/${id}/`),

    // --- Students (dedicated endpoint, always STUDENT type) ---
    getStudents: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return normalize(await apiMethods.get(`/people/students/${query ? '?' + query : ''}`));
    },
    getStudent: (id) => apiMethods.get(`/people/students/${id}/`),
    createStudent: (data) => apiMethods.post('/people/students/', data),
    updateStudent: (id, data) => apiMethods.put(`/people/students/${id}/`, data),
    patchStudent: (id, data) => apiMethods.patch(`/people/students/${id}/`, data),
    deleteStudent: (id) => apiMethods.delete(`/people/students/${id}/`),

    // --- Enrollment actions on StudentViewSet ---
    enrollStudent: (studentId, data) =>
        apiMethods.post(`/people/students/${studentId}/enroll/`, data),
    unenrollStudent: (studentId, enrollmentId) =>
        apiMethods.delete(`/people/students/${studentId}/enroll/`, { enrollment_id: enrollmentId }),

    // --- Person type helpers (general people endpoint) ---
    getTeachers: async () => normalize(await apiMethods.get('/people/persons/?person_type=TEACHER')),
    getStaff: async () => normalize(await apiMethods.get('/people/persons/?person_type=STAFF')),

    // --- User Account Association ---
    linkUser: (personId, userId) =>
        apiMethods.post(`/people/students/${personId}/link-user/`, { user_id: userId }),
    unlinkUser: (personId) =>
        apiMethods.delete(`/people/students/${personId}/link-user/`),
};

export default peopleService;
