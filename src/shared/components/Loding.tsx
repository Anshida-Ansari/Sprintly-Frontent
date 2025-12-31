const LoadingExperience = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-[#FDFDFF]">
      <div className="flex flex-col items-center gap-6">
        {/* Modern "Pulse and Orbit" Loader */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
          {/* Animated Spinning Orbit */}
          <div className="absolute w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          {/* Inner Pulsing Dot */}
          <div className="absolute w-4 h-4 bg-indigo-600 rounded-full animate-ping"></div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-gray-900 font-bold tracking-widest text-sm uppercase">
            Loading
          </p>
          <p className="text-gray-400 text-xs animate-pulse">
            Preparing your workspace...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingExperience;