import {useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Phone, Mail, MapPin, MessageSquare, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { Spin } from "antd";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

// Mock client data
const clientInit = {
  name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  totalOrders: 0,
  activeOrders: 0,
  completedOrders: 0,
  totalSpent: 0,
  joinDate: "",
  measurements: {
    chest: "",
    waist: "",
    hips: "",
    shoulders: "",
    armLength: "",
    totalLength: "",
    neck: "",
    inseam: ""
  },
  recentOrders: [
   
  ]
};

const ClientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [client, setClient] = useState(clientInit);

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
  const handleClientGet = async (clientId: string) => {
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/client/get/${clientId}`, {
        withCredentials: true, // send session cookie
      });
  
      setClient(response.data.client); // assuming client is an object
  
      // console.log("Client fetched:", response.data.client);
    } catch (error) {
      console.error("Failed to fetch client:", error);
    }
  };
  useEffect(() => {
    // console.log(id)
    if (id) {
      handleClientGet(id);
    }
  }, []);

  if ( client.name === "") return <div className="h-screen flex items-center justify-center bg-background p-4"><Spin size="large" /></div>;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/app/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">Client Details</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/app/clients/edit/${id}`)}
          className="flex items-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{client.totalOrders}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{client.activeOrders}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">${client.totalOrderPrice}</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone_no}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span>{client.address}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex space-x-2">
            <Button 
              onClick={sendMessage}
              className="flex-1 flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Send Message</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/app/orders/add")}
              className="flex-1 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Order</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Client Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{client.note}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Customer since: {" "}
                    {new Date(client.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
          </p>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shoulders:</span>
                <span className="font-medium">{client.measurements.shoulders}"</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arm Length:</span>
                <span className="font-medium">{client.measurements.armLength}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Length:</span>
                <span className="font-medium">{client.measurements.totalLength}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Neck:</span>
                <span className="font-medium">{client.measurements.neck}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inseam:</span>
                <span className="font-medium">{client.measurements.inseam}"</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {client.recentOrders.map((order) => (
            <div key={order._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{order.item}</p>
                <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}</p>
              </div>
              <div className="text-right space-y-1">
                <Badge className={getStatusColor(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
                <p className="text-sm font-medium">${order.price}</p>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/app/orders")}
          >
            View All Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetails;