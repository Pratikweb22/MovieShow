import axios from 'axios';


const token = localStorage.getItem('token');

export const axiosInstance = axios.create({
  baseURL: "https://movie-show-eight.vercel.app",
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