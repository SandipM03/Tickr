import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CheckAuth from './components/check-auth.jsx'
import Tickets from './pages/Tickets.jsx'
import TicketDetailsPage from './pages/Ticket.jsx'
import Signup from './pages/Signup.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'
import Navbar from './components/Navbar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route 
        path="/" 
        element={
        <CheckAuth protectedRoute={true}>
          <Tickets />
        </CheckAuth>
        }
      />

      <Route 
        path="/ticket/:id" 
        element={
        <CheckAuth protectedRoute={true}>
          <TicketDetailsPage />
        </CheckAuth>
        }
      />

        <Route 
          path="/signup" 
          element={
          <CheckAuth protectedRoute={false}>
            <Signup />
          </CheckAuth>
          }
        />

        <Route 
          path="/login" 
          element={
          <CheckAuth protectedRoute={false}>
            <Login />
          </CheckAuth>
          }
        />

        <Route 
          path="/admin" 
          element={
          <CheckAuth protectedRoute={true}>
            <Admin/>
          </CheckAuth>
          }
        />
      
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
