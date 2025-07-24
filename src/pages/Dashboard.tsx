import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Plus
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { Spin } from "antd";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
// Mock data
const mockData = {
  businessName: "", // Changed from tailorName to shopName
  todayOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  upcomingDeliveries: [
  ]
};

// Function to get shop name from localStorage or settings


const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(mockData)

console.log(data)
  const handleGetData = async() => {
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/general/summary`,{
        withCredentials: true
      });
      // console.log("Dashboard Data:", response.data);
      // Set state here if needed
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready": return "bg-success text-success-foreground";
      case "In Progress": return "bg-warning text-warning-foreground";
      case "Pending": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };
  useEffect(()=>{
    handleGetData()
  },[]);

  if(data.businessName === "") return <div className="h-screen flex items-center justify-center bg-background p-4"><Spin size="large" /></div>;
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome to {data?.businessName}
        </h1>
        <p className="text-muted-foreground">Here's what's happening in your business today</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{data.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{data.completedOrders}</div>
            <p className="text-xs text-muted-foreground">Total completed this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deliveries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Upcoming Deliveries</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/app/orders")}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.upcomingDeliveries.map((delivery) => (
            <div key={delivery._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-sm">{delivery.clientName}</p>
                <p className="text-xs text-muted-foreground">{delivery.item}</p>
                <p className="text-xs text-primary">
               
                  {new Date(delivery.deliveryDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
              </div>
              <Badge className={getStatusColor(delivery.orderStatus)}>
                {delivery.orderStatus}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-16 flex flex-col space-y-1"
          onClick={() => navigate("/app/orders/add")}
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm">New Order</span>
        </Button>
        
        <Button 
          variant="outline"
          className="h-16 flex flex-col space-y-1"
          onClick={() => navigate("/app/clients/add")}
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm">New Client</span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;