// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:5011/api', 
// });

// export const documentAPI = {
//   // ড্যাশবোর্ডে আপনি 'getDocuments' কল করছেন, তাই এখানে নাম ঠিক করে নিন
//   getDocuments: () => API.get('/documents'), 
//   uploadPdf: (formData) => API.post('/upload-pdf', formData),
//   generateLink: (data) => API.post('/generate-link', data),
//   getById: (id) => API.get(`/doc/${id}`),
//   submitSign: (id, data) => API.post(`/submit-sign/${id}`, data)
// };

// import axios from 'axios';
// const API = axios.create({ baseURL: 'http://localhost:5011/api' });
// export const documentAPI = {
//   getDocuments: () => API.get('/documents'),
//   uploadPdf: (formData) => API.post('/upload-pdf', formData),
//   generateLink: (data) => API.post('/generate-link', data),
//   getById: (id) => API.get(`/doc/${id}`),
//   downloadDoc: (id) => API.get(`/documents/download/${id}`), // New
//   submitSign: (id, data) => API.post(`/submit-sign/${id}`, data)
// };\
//after mail

// import axios from 'axios';
// const API = axios.create({ baseURL: 'http://localhost:5011/api' });

// export const documentAPI = {
//   getDocuments: () => API.get('/documents'),
//   uploadPdf: (formData) => API.post('/upload-pdf', formData),
//   generateLink: (data) => API.post('/generate-link', data),
//   getById: (id) => API.get(`/doc/${id}`),
//   downloadDoc: (id) => API.get(`/documents/download/${id}`),
//   submitSign: (id, data) => API.post(`/submit-sign/${id}`, data),
//   verifyOtp: (data) => API.post('/verify-otp', data) // Important fix
// };



//deploy
// import axios from 'axios';

// const API = axios.create({ 
//   baseURL: 'https://nextsignbackemd.onrender.com/api' 
// });

// export const documentAPI = {
//   getDocuments: () => API.get('/documents'),
//   uploadPdf: (formData) => API.post('/upload-pdf', formData),
//   generateLink: (data) => API.post('/generate-link', data),
//   getById: (id) => API.get(`/doc/${id}`),
//   downloadDoc: (id) => API.get(`/documents/download/${id}`),
//   submitSign: (id, data) => API.post(`/submit-sign/${id}`, data),
//   verifyOtp: (data) => API.post('/verify-otp', data)
// };
// src/api/api.js
// import axios from 'axios';

// const API = axios.create({ 
//   baseURL: 'https://nextsignbackend-bisal-sahas-projects.vercel.app/api', // No trailing slash
//   withCredentials: true 
// });

// export const documentAPI = {
//   getDocuments: () => API.get('/documents'),
//   generateLink: (data) => API.post('/generate-link', data),
//   getById: (id) => API.get(`/doc/${id}`),
//   submitSign: (id, data) => API.post(`/submit-sign/${id}`, data),
//   verifyOtp: (data) => API.post('/verify-otp', data)
// };

import axios from 'axios';

const API = axios.create({ 
  // Base URL-e /api thakle backend routes-e /api thakar dorkar nai (matching index.js)
  baseURL: 'https://nextsignbackend-bisal-sahas-projects.vercel.app/api', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response Interceptor for better debugging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const documentAPI = {
  // Fetch all documents for dashboard
  getDocuments: () => API.get('/documents'),
  
  // Create new document entry
  generateLink: (data) => API.post('/generate-link', data),
  
  // Get doc by ID for signing page
  getById: (id) => API.get(`/doc/${id}`),
  
  // Submit signature to initiate OTP
  submitSign: (id, data) => API.post(`/submit-sign/${id}`, data),
  
  // Verify OTP and trigger PDF generation
  verifyOtp: (data) => API.post('/verify-otp', data),

  // ✅ New: Download trigger for Dashboard
  downloadDoc: (id) => API.get(`/doc/${id}`) 
};