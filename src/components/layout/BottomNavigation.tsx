import { NavLink, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Users, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/app", icon: Home },
  { name: "Orders", href: "/app/orders", icon: ShoppingBag },
  { name: "Clients", href: "/app/clients", icon: Users },
  { name: "Reports", href: "/app/reports", icon: BarChart3 },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = item.href === "/app" 
              ? location.pathname === "/app"
              : location.pathname.startsWith(item.href) && item.href !== "/app";
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-3 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon 
                  className={cn(
                    "h-6 w-6 mb-1",
                    isActive && "fill-current"
                  )} 
                />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;