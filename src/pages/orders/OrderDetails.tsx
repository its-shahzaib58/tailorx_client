import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Phone, Calendar, DollarSign, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

// Mock order data

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState({_id : ""})
  const [client, setClient] = useState({})

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success text-success-foreground";
      case "Ready": return "bg-accent text-accent-foreground";
      case "In Progress": return "bg-warning text-warning-foreground";
      case "Pending": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const sendMessage = () => {
    toast({
      title: "Message sent!",
      description: `WhatsApp message sent to ${client.name}`,
    });
  
    window.open(`https://wa.me/${client.phone_no}?text=Hello%20${client.name},%20this%20is%20a%20reminder...`, "_blank");
  };


  const handleOrderGet = async (id: string) => {
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/order/get/${id}`, {
        withCredentials: true, // ensure session-based auth is sent
      });
  
      const { order, client } = response.data;
  
      console.log("Order:", order);
      console.log("Client:", client);
  
      // You can now update local state with these details if needed
      setOrder(order);
      setClient(client);
  
    } catch (error) {
      console.error("Failed to fetch order and client details:", error);
      toast({
        variant: "destructive",
        title: "Error fetching order",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };
  useEffect(()=>{
    if(id)
      {
        handleOrderGet(id)
      }
  },[id])
  if ( order._id === "") return <Spinner />;
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/app/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{order.orderId}</h1>
            <p className="text-muted-foreground">Order Details</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/app/orders/edit/${id}`)}
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </div>

      {/* Status & Quick Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Badge className={getStatusColor(order.orderStatus)}>
              {order.orderStatus}
            </Badge>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">${order?.price}</p>
              <p className="text-sm text-muted-foreground">Total Amount</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Delivery Date</p>
                <p className="text-muted-foreground">{" "}
                    {new Date(order.deliveryDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-semibold text-lg">{client.name}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground">{client.phone_no}</p>
            </div>
            <p className="text-muted-foreground mt-1">{client.address}</p>
          </div>
          
          <Button 
            onClick={sendMessage}
            className="w-full flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Send WhatsApp Message</span>
          </Button>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Item/Garment</p>
            <p className="text-lg">{order.item}</p>
          </div>
          
          <Separator />
          
          <div>
            <p className="font-medium">Order Notes</p>
            <p className="text-muted-foreground mt-1">{order.notes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Measurements */}
      <Card>
        <CardHeader>
          <CardTitle>Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Chest:</span>
                <span className="font-medium">{client.measurements.chest}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Waist:</span>
                <span className="font-medium">{client.measurements.waist}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hips:</span>
                <span className="font-medium">{client.measurements.hips}"</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shoulders:</span>
                <span className="font-medium">{client.measurements.shoulders}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arm Length:</span>
                <span className="font-medium">{client.measurements.armLength}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Length:</span>
                <span className="font-medium">{client.measurements.totalLength}"</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

       {/* Custom Measurements */}
       {order.customMeasurements.length > 0 ? 
       <Card>
       <CardHeader>
         <CardTitle>Custom Measurements</CardTitle>
       </CardHeader>
       <CardContent>
         <div className="grid grid-cols-1 gap-4">
           <div className="space-y-3">
             {order.customMeasurements.map((cm)=>{
                 return(
                   <div key={cm._id} className="flex justify-between">
                   <span className="text-muted-foreground">{cm.name}:</span>
                   <span className="font-medium">{cm.value}"</span>
                 </div>
                 )
             })}
            
           </div>
         </div>
       </CardContent>
     </Card>
     :""
      }
       
    </div>
  );
};

export default OrderDetails;