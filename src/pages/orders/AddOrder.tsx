import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

// Mock customers data
const mockCustomers = [
  { id: 1, name: "Sarah Johnson", phone: "+1 (555) 123-4567" },
  { id: 2, name: "Mike Chen", phone: "+1 (555) 234-5678" },
  { id: 3, name: "Emma Davis", phone: "+1 (555) 345-6789" }
];

const AddOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    item: "",
    notes: "",
    deliveryDate: "",
    price: "",
    stitchCategory: "",
    customMeasurements: [] as { name: string; value: string }[]
  });
  const handleClientGet = async () => {
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/client/get`, {
        withCredentials: true, // sends session cookie for authentication
      });
  
      setClients(response.data.clients); // assuming API returns { clients: [...] }
  
      // console.log("Clients fetched:", response.data.clients);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    
    if (!formData.customerId || !formData.item || !formData.deliveryDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
  
    try {
      const response = await axios.post(`${SERVER_DOMAIN}/order/add`, formData, {
        withCredentials: true, // if using session auth
      });
      // console.log(response.status)
      if (response.status === 201) {
        toast({
          title: "Order created successfully!",
          description: "The order has been added to your system",
        });
  
        navigate("/app/orders");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unexpected response from server",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create order",
        description: error.response?.data?.message || "Server error occurred",
      });
    }
  };
  

  useEffect(()=>{
    handleClientGet();
  },[])

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/app/orders")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Select Customer *</Label>
              <Select value={formData.customerId} onValueChange={(value) => setFormData({...formData, customerId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose existing customer" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id.toString()}>
                      {customer.name} - {customer.phone_no}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="button"
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/app/clients/add")}
            >
              + Add New Customer
            </Button>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item">Item/Garment *</Label>
              <Input
                id="item"
                placeholder="e.g., Wedding Dress, Business Suit"
                value={formData.item}
                onChange={(e) => setFormData({...formData, item: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date *</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                placeholder="Special instructions, fabric details, etc."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stitch Category & Measurements */}
        <Card>
          <CardHeader>
            <CardTitle>Stitch Category & Custom Measurements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stitchCategory">Stitch Category</Label>
              <Select 
                value={formData.stitchCategory || ""} 
                onValueChange={(value) => setFormData({...formData, stitchCategory: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stitch category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal-wear">Formal Wear</SelectItem>
                  <SelectItem value="casual-wear">Casual Wear</SelectItem>
                  <SelectItem value="wedding-dress">Wedding Dress</SelectItem>
                  <SelectItem value="suit">Business Suit</SelectItem>
                  <SelectItem value="alterations">Alterations</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Custom Measurements</Label>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData({
                    ...formData,
                    customMeasurements: [...(formData.customMeasurements || []), { name: '', value: '' }]
                  })}
                >
                  + Add Measurement
                </Button>
              </div>
              
              {formData.customMeasurements?.map((measurement, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    placeholder="Measurement name (e.g., Chest)"
                    value={measurement.name}
                    onChange={(e) => {
                      const updated = [...(formData.customMeasurements || [])];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setFormData({...formData, customMeasurements: updated});
                    }}
                  />
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="Value"
                    value={measurement.value}
                    onChange={(e) => {
                      const updated = [...(formData.customMeasurements || [])];
                      updated[index] = { ...updated[index], value: e.target.value };
                      setFormData({...formData, customMeasurements: updated});
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = formData.customMeasurements?.filter((_, i) => i !== index) || [];
                      setFormData({...formData, customMeasurements: updated});
                    }}
                  >
                    ×
                  </Button>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom measurements added yet. Click "Add Measurement" to start.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <Button 
            type="button"
            variant="outline" 
            className="flex-1"
            onClick={() => navigate("/app/orders")}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;