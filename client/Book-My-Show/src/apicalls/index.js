import axios from 'axios';

const token = localStorage.getItem('token');

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true, // Only if using cookies/sessions
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  }
});

axiosInstance.interceptors.request.use(function (request){
  const token = localStorage.getItem('token');
  if(token){
    request.headers['Authorization'] = `Bearer ${token}`;
  }
  return request;
}, function (error) {
  return Promise.reject(error);
})