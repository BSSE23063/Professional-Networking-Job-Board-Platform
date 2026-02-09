import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/Layout/PrivateRoute";

// Layout Components
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./pages/Dashboard";
import JobsPage from "./pages/JobsPage";
import JobDetail from "./components/Jobs/JobDetail";
import ApplicationsPage from "./pages/ApplicationsPage";
import CompaniesPage from "./pages/CompaniesPage";
import CommunityPage from "./pages/CommunityPage";
import Profile from "./components/Auth/Profile";
import RegisterCompany from "./components/Company/RegisterCompany";

import "./styles/App.css";
import CompanyDetails from "./components/Company/CompanyDetails";
import PostJob from "./pages/PostJob";

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route
                path="/applications"
                element={
                  <PrivateRoute>
                    <ApplicationsPage />
                  </PrivateRoute>
                }
              />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/companies/:id" element={<CompanyDetails />} />
              <Route
                path="/companies/register"
                element={
                  <PrivateRoute>
                    <RegisterCompany />
                  </PrivateRoute>
                }
              />
              <Route path="/community" element={<CommunityPage />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

export default App;
