import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute adminOnly={false}>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin login redirect to unified login page */}
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManageLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <ProtectedRoute adminOnly={true}>
                <ManagePackages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages/new"
            element={
              <ProtectedRoute adminOnly={true}>
                <PackageForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages/:id/edit"
            element={
              <ProtectedRoute adminOnly={true}>
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
