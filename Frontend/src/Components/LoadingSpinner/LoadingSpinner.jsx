import React from "react";

function LoadingSpinner() {
  return (
    <div>
      <div className="flex space-x-1 items-center justify-center h-8">
        <span className="w-2 h-2 bg-orange-600 rounded-full animate-ping"></span>
        <span
          className="w-2 h-2 bg-orange-600 rounded-full animate-ping"
          style={{ animationDelay: "0.15s" }}
        ></span>
        <span
          className="w-2 h-2 bg-orange-600 rounded-full animate-ping"
          style={{ animationDelay: "0.3s" }}
        ></span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
