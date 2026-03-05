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

import axios from 'axios';

// 🚀 Localhost change kore Render URL kora hoyeche
const API = axios.create({ 
  baseURL: 'https://nextsignbackemd.onrender.com/api' 
});

export const documentAPI = {
  // 📄 Sob documents list dekhabe
  getDocuments: () => API.get('/documents'),
  
  // 📁 PDF upload korbe (Cloudinary-te jabe)
  uploadPdf: (formData) => API.post('/upload-pdf', formData),
  
  // 🔗 Signing link generate korbe
  generateLink: (data) => API.post('/generate-link', data),
  
  // 🔍 Document-er detail anbe ID diye
  getById: (id) => API.get(`/doc/${id}`),
  
  // 📥 Signed ba original PDF download korbe
  downloadDoc: (id) => API.get(`/documents/download/${id}`),
  
  // ✉️ Signature draw korar por OTP pathabe
  submitSign: (id, data) => API.post(`/submit-sign/${id}`, data),
  
  // ✅ OTP verify kore final PDF merge korbe
  verifyOtp: (data) => API.post('/verify-otp', data)
};