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

import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://nextsignbackemd.onrender.com/api' 
});

export const documentAPI = {
  getDocuments: () => API.get('/documents'),
  
  // ✅ Multipart header add kora hoyeche upload-er jonno
  uploadPdf: (formData) => API.post('/upload-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  generateLink: (data) => API.post('/generate-link', data),
  getById: (id) => API.get(`/doc/${id}`),
  downloadDoc: (id) => API.get(`/doc/${id}`),
  submitSign: (id, data) => API.post(`/submit-sign/${id}`, data),
  verifyOtp: (data) => API.post('/verify-otp', data)
};