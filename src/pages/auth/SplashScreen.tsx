import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // Changed to 3 seconds for better UX

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-accent animate-fade-in">
      <div className="text-center text-white">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
            <Scissors className="w-16 h-16 text-white" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto bg-white/10 rounded-full animate-ping"></div>
        </div>
        <h1 className="text-5xl font-bold mb-3 tracking-tight">TailorX</h1>
        <p className="text-xl text-white/90 mb-2">Professional Tailor Management</p>
        <p className="text-sm text-white/70">Streamline your tailoring business</p>
        <div className="mt-12">
          <div className="w-8 h-8 mx-auto border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-xs text-white/60 mt-4">Loading your workspace...</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;