import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Go back to where the user came from, or home if none
    navigate(location.state?.from?.pathname || "/", { replace: true });

  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-semibold text-red-600 mb-4">
        Access Denied
      </h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>
      <div className="flex gap-3">
        
        <button
          onClick={() => navigate("/", { replace: true })}
          className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
