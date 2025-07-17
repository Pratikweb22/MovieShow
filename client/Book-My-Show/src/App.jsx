import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import {Provider} from 'react-redux';
import  store  from './redux/store'
import Admin from './Pages/Admin'
import Partner from './Pages/Partner'
import Profile from './Pages/Profile'
import Movie from './Pages/Movie'
import BookShow from './Pages/BookShow'
import { getAllMovies } from './apicalls/movie'
import { useEffect } from 'react';
import { GetCurrentUser } from './apicalls/user';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from './redux/userSlice';
import { hideLoading, showLoading } from './redux/loaderSlice';
import Forget from './Pages/Forget'
import Reset from './Pages/Reset'
import PaymentSuccess from './Pages/PaymentSuccess'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
      <BrowserRouter>
       <Routes>
            <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
            <Route path="/partner" element={<ProtectedRoute><Partner/></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
           <Route path="/forget" element={<Forget/>} />
             <Route path="/reset" element={<Reset/>} /> 
            <Route
            path="/book-show/:showId"
            element={
              <ProtectedRoute>
                <BookShow />
              </ProtectedRoute>
            }
          />
             <Route
            path="/movies/:movieId"
            element={
              <ProtectedRoute>
                <Movie />
              </ProtectedRoute>
            }
          />
           <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
       </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
