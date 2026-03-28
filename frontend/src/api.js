import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

export const login          = (data)      => API.post('/auth/login', data);
export const getStudents    = ()          => API.get('/students/');
export const getStudentReport    = (id)   => API.get(`/students/${id}/report`);
export const getStudentAttendance= (id)   => API.get(`/students/${id}/attendance`);
export const getAtRisk      = ()          => API.get('/analytics/at-risk');
export const getRankings    = ()          => API.get('/analytics/rankings');
export const getPassRate    = ()          => API.get('/analytics/subject-passrate');
export const getTopPerformers = ()        => API.get('/analytics/top-performers');
export const getDashboardSummary = ()     => API.get('/analytics/dashboard-summary');
export const getMLPredictions = ()   => API.get('/ml/predict-all');
export const getAIReport      = (id) => API.get(`/ai/report/${id}`);