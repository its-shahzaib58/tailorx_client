import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "@/pages/auth/auth"; // update the path accordingly
import { Spin } from 'antd';

const PublicRoute = () => {
  const [auth, setAuth] = useState<null | boolean>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      setAuth(loggedIn);
    };
    checkAuth();
  }, []);

  if (auth === null) return <div className="h-screen flex items-center justify-center bg-background p-4"><Spin size="large" /></div>;
  return auth ? <Navigate to="/app" /> : <Outlet />;
};

export default PublicRoute;
