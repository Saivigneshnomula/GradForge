import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b18] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />

          <p className="text-slate-400 mt-4 text-sm">
            Loading GradForge...
          </p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;