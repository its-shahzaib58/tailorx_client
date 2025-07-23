import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Eye, Edit, Phone } from "lucide-react";
import axios from "axios";
import Spinner from "@/components/Spinner";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
// Mock clients data


const Clients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);

  const handleClientGet = async () => {
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/client/get`, {
        withCredentials: true, // sends session cookie for authentication
      });
  
      setClients(response.data.clients); // assuming API returns { clients: [...] }
  
      console.log("Clients fetched:", response.data.clients);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone_no.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(()=>{
    handleClientGet();
  },[]);
  if ( clients.length <= 0) return <Spinner />;
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button 
          onClick={() => navigate("/app/clients/add")}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Client</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Clients List */}
      <div className="space-y-3">
        {filteredClients.map((client) => (
          <Card key={client._id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-lg">{client.name}</p>
                    {client.activeOrders > 0 && (
                      <Badge variant="secondary">
                        {client.activeOrders} {"Active"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{client.phone_no}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium"> {client.totalOrders} orders</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-3">
                <p>{client.address}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  <span>Measurements: </span>
                  <span>{client.measurements.chest}" - {client.measurements.waist}" - {client.measurements.hips}"</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/app/clients/${client._id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/app/clients/edit/${client._id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No clients found</p>
          <Button 
            className="mt-4"
            onClick={() => navigate("/app/clients/add")}
          >
            Add your first client
          </Button>
        </div>
      )}
    </div>
  );
};

export default Clients;