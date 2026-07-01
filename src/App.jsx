import { Routes, Route } from 'react-router-dom'
import LoginPage from './auth/LoginPage'
import DonorDashboard from './donor/DonorDashboard'
import PostFoodForm from './donor/PostFoodForm'
import NgoDashboard from './ngo/NgoDashboard'
import PickupDetail from './ngo/PickupDetail'
import AdminDashboard from './admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import RegisterDonorPage from './auth/RegisterDonorPage'
import RegisterNgoPage from './auth/RegisterNgoPage'
import LandingPage from './pages/LandingPage'


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/donor" element={
        <ProtectedRoute allowedRole="DONOR"><DonorDashboard /></ProtectedRoute>
      } />
      <Route path="/donor/post" element={
        <ProtectedRoute allowedRole="DONOR"><PostFoodForm /></ProtectedRoute>
      } />

      <Route path="/ngo" element={
        <ProtectedRoute allowedRole="NGO"><NgoDashboard /></ProtectedRoute>
      } />
      <Route path="/ngo/pickup/:id" element={
        <ProtectedRoute allowedRole="NGO"><PickupDetail /></ProtectedRoute>
      } />
      <Route path="/register/donor" element={<RegisterDonorPage />} />
<Route path="/register/ngo" element={<RegisterNgoPage />} />

      <Route path="/admin" element={
        <ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App