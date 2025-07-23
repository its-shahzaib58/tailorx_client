import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication pages
import SplashScreen from "./pages/auth/SplashScreen";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OTPVerification from "./pages/auth/OTPVerification";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";

// Main app layout
import MainLayout from "./components/layout/MainLayout";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Orders
import Orders from "./pages/orders/Orders";
import AddOrder from "./pages/orders/AddOrder";
import EditOrder from "./pages/orders/EditOrder";
import OrderDetails from "./pages/orders/OrderDetails";

// Clients
import Clients from "./pages/clients/Clients";
import AddClient from "./pages/clients/AddClient";
import EditClient from "./pages/clients/EditClient";
import ClientDetails from "./pages/clients/ClientDetails";

// Reports
import Reports from "./pages/Reports";

// Settings
import Settings from "./pages/settings/Settings";
import EditMessageTemplate from "./pages/settings/EditMessageTemplate";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes (Auth) */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
          </Route>

          {/* Protected Routes (Main App) */}
          <Route path="/app" element={<ProtectedRoute />}>
          <Route path="change-password" element={<ChangePassword />} />
            <Route path="" element={<MainLayout />}>
              <Route index element={<Dashboard />} />

              {/* Orders */}
              <Route path="orders" element={<Orders />} />
              <Route path="orders/add" element={<AddOrder />} />
              <Route path="orders/edit/:id" element={<EditOrder />} />
              <Route path="orders/:id" element={<OrderDetails />} />

              {/* Clients */}
              <Route path="clients" element={<Clients />} />
              <Route path="clients/add" element={<AddClient />} />
              <Route path="clients/edit/:id" element={<EditClient />} />
              <Route path="clients/:id" element={<ClientDetails />} />

              {/* Reports */}
              <Route path="reports" element={<Reports />} />

              {/* Settings */}
              <Route path="settings" element={<Settings />} />
              
              <Route
                path="settings/message-template"
                element={<EditMessageTemplate />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
