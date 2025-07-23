import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Spinner from "@/components/Spinner";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

// Mock orders data

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);

  const filteredOrders = orders.filter(
    (order) =>
      order.customerId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success text-success-foreground";
      case "Ready":
        return "bg-accent text-accent-foreground";
      case "In Progress":
        return "bg-warning text-warning-foreground";
      case "Pending":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const markAsComplete = async (orderId: string) => {
    try {
      // Call the backend API to update order status
      const res = await axios.put(`${SERVER_DOMAIN}/order/update-status/${orderId}`);
  
      // Update local state only if API is successful
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "Completed" } : order
        )
      );
  
      toast({
        title: "Order marked as completed",
        description: res.data.message,
      });
    } catch (error: any) {
      console.error("Failed to update order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleOrderGet = async () => {
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/order/get`, {
        withCredentials: true, // sends session cookie for authentication
      });

      setOrders(response.data.orders); // assuming API returns { orders: [...] }

      console.log("Orders fetched:", response.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    handleOrderGet();
  }, []);
  if ( orders.length <= 0) return <Spinner />;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button
          onClick={() => navigate("/app/orders/add")}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Order</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders, customers, or items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <Card key={order._id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{order.customerId.name}</p>
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.orderId}</p>
                  <p className="text-sm">{order.item}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-primary">${order.price}</p>
                  <p className="text-xs text-muted-foreground">
                    Due:{" "}
                    {new Date(order.deliveryDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/app/orders/${order._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/app/orders/edit/${order._id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>

                {order.orderStatus !== "Completed" && (
                  <Button
                    size="sm"
                    onClick={() => markAsComplete(order._id)}
                    className="bg-success hover:bg-success/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders found</p>
          <Button className="mt-4" onClick={() => navigate("/app/orders/add")}>
            Create your first order
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders;
