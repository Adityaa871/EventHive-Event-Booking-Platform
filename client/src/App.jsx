import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Public pages
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Booking from './pages/Booking';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageLeads from './pages/admin/ManageLeads';
import ManagePackages from './pages/admin/ManagePackages';
import PackageForm from './pages/admin/PackageForm';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          {/* Public & Customer routes with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          {/* Admin login (no layout wrapper) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute>
                <ManageLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <ProtectedRoute>
                <ManagePackages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages/new"
            element={
              <ProtectedRoute>
                <PackageForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages/:id/edit"
            element={
              <ProtectedRoute>
                <PackageForm />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
