import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-16 overflow-auto">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;