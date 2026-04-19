import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Order from './pages/Order';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Portfolio from './pages/Portfolio';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Navbar />
    <main style={{ minHeight: '80vh' }}>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/services"     element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/portfolio"    element={<Portfolio />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/order"        element={<PrivateRoute><Order /></PrivateRoute>} />
        <Route path="/dashboard"    element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
        <Route path="/admin"        element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
