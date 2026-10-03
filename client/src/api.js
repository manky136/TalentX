import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth – User
export const userRegister = (data) => api.post('/auth/register', data);
export const userLogin    = (data) => api.post('/auth/login', data);
export const userLogout   = ()     => api.get('/auth/logout');
export const getMe        = ()     => api.get('/auth/get-me');
export const refreshToken = ()     => api.get('/auth/refresh-token');

// Auth – Org
export const orgRegister  = (data) => api.post('/org/register', data);
export const orgLogin     = (data) => api.post('/org/login', data);
export const orgLogout    = ()     => api.post('/org/logout');
export const getOrgMe     = ()     => api.get('/org/get-me');
export const updateOrgProfile = (data) => api.put('/org/profile', data);

// User profile
export const getUserProfile  = ()     => api.get('/user/profile');
export const updateUserProfile = (data) => api.put('/user/profile', data);
export const uploadResume    = (data) => api.post('/user/resume', data);
export const getRoadmap      = ()     => api.get('/user/roadmap');

// Jobs
export const getJobs    = (params) => api.get('/jobs', { params });
export const getJobById = (id)     => api.get(`/jobs/${id}`);
export const createJob  = (data)   => api.post('/jobs', data);
export const updateJob  = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob  = (id)     => api.delete(`/jobs/${id}`);
export const applyToJob = (id)     => api.post(`/jobs/${id}/apply`);
export const getMyJobs  = ()       => api.get('/jobs/org/mine');

// Courses
export const getCourses    = (params) => api.get('/courses', { params });
export const getCourseById = (id)     => api.get(`/courses/${id}`);
export const createCourse  = (data)   => api.post('/courses', data);
export const updateCourse  = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse  = (id)     => api.delete(`/courses/${id}`);
export const getMyCourses  = ()       => api.get('/courses/org/mine');

export default api;
