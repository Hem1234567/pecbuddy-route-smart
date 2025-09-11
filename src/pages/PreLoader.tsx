import React, { useEffect, useState } from "react";

const PreLoader = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo - Replace with your actual image path */}
        <div className="mb-6 flex justify-center">
          <img src="/image (1).png" alt="Logo" className="h-40 w-auto" />
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto mb-2">
          <div
            className="h-full bg-black transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-md font-semibold text-gray-500">Loading...</div>
      </div>
    </div>
  );
};

export default PreLoader;
