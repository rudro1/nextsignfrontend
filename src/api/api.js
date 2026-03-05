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
  // ✅ Vercel Backend URL thik ache
  baseURL: 'https://nextsignbackend-bisal-sahas-projects.vercel.app/api',
  // ✅ CORS handling-er jonno eita thaka dorkar
  withCredentials: true 
});

export const documentAPI = {
  // Shob documents fetch kora
  getDocuments: () => API.get('/documents'),
  
  // ✅ PDF Upload (Cloudinary-te jay)
  uploadPdf: (formData) => API.post('/upload-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' } // Multer er jonno eita must
  }),
  
  // Link generate kora
  generateLink: (data) => API.post('/generate-link', data),
  
  // Document details ana
  getById: (id) => API.get(`/doc/${id}`),
  
  // Download kora
  downloadDoc: (id) => API.get(`/doc/${id}`),
  
  // Sign submit kora
  submitSign: (id, data) => API.post(`/submit-sign/${id}`, data),
  
  // OTP verify kora
  verifyOtp: (data) => API.post('/verify-otp', data)
};