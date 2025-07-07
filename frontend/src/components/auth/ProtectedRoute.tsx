import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner/LoadingSpinner";
import { getUserProfile } from "../../api/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireOnboarding = false,
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();
  const [onboardingCompleted, setOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isAuthenticated && requireOnboarding) {
        setCheckingOnboarding(true);
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const profileData = await getUserProfile(token);
            // For now, we'll assume onboarding is completed if user has preferences
            // In the future, we can add an onboardingCompleted field to the user profile
            setOnboardingCompleted(true); // This will be updated when backend supports it
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setOnboardingCompleted(false);
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, requireOnboarding]);

  if (isLoading || checkingOnboarding) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // For now, we'll skip the onboarding check since the backend doesn't support it yet
  // This can be uncommented when the backend supports onboardingCompleted field
  /*
  if (requireOnboarding && onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }
  */

  return <>{children}</>;
};

export default ProtectedRoute;
