import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import Movies from "./pages/Movies/Movies";
import Auth from "./pages/Auth/Auth";
import Onboarding from "./pages/Onboarding/Onboarding";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import EducationalPage from "./pages/EducationalPage";
import styles from "./App.module.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Hide Header/Footer on Auth, Onboarding, Landing, and NotFound pages
  const hideLayout =
    location.pathname.startsWith("/auth") ||
    location.pathname === "/onboarding" ||
    location.pathname === "/" ||
    location.pathname === "/404";

  return (
    <>
      {!hideLayout && <Header />}
      <div
        className={styles.app}
        style={{ paddingTop: hideLayout ? "0" : "80px" }}
      >
        {children}
      </div>
      {!hideLayout && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/educational" element={<EducationalPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                //<ProtectedRoute>
                  <ProfilePage />
                //</ProtectedRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
