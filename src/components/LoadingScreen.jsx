import { gradient } from "../assets";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-[80px] h-[80px] border-4 border-n-1/10 border-t-color-1 rounded-full animate-spin mb-6"></div>
            <p className="h4 text-n-1/50">Loading...</p>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute top-0 -left-[10rem] w-[56.625rem] h-[56.625rem] opacity-50 mix-blend-color-dodge pointer-events-none">
          <img
            className="absolute top-1/2 left-1/2 w-[79.5625rem] h-[88.5625rem] -translate-x-1/2 -translate-y-1/2"
            src={gradient}
            alt="Gradient"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 