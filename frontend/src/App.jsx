import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import PreviousParticipants from './pages/PreviousParticipants';
import Rules from './pages/Rules';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ParticipantList from './pages/admin/ParticipantList';
import TeamAllocation from './pages/admin/TeamAllocation';
import PreviousParticipantsAdmin from './pages/admin/PreviousParticipantsAdmin';
import TeamList from './pages/admin/TeamList';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Navbar />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancel" element={<PaymentCancel />} />
                <Route path="/previous-participants" element={<PreviousParticipants />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="participants" element={<ParticipantList />} />
                  <Route path="teams" element={<TeamList />} />
                  <Route path="team-allocation" element={<TeamAllocation />} />
                  <Route path="previous-participants" element={<PreviousParticipantsAdmin />} />
                </Route>
              </Routes>
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
