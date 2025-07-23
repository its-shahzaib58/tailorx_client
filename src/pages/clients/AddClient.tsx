import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Ruler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AddClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone_no: "",
    email: "",
    address: "",
    note: "",
    measurements: {
      chest: "",
      waist: "",
      hips: "",
      shoulders: "",
      armLength: "",
      totalLength: "",
      neck: "",
      inseam: ""
    }
  });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone_no.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name and phone number are required",
      });
      return;
    }
    if (!/^\d{12}$/.test(formData.phone_no)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Phone Number must be exactly 12 digits and only contain numbers.",
      });
      return;
    }
  
   
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/client/add`, // ✅ your API route
        formData,
        { withCredentials: true } // ✅ to include session cookies
      );
  
      toast({
        title: "Client added successfully!",
        description: `${formData.name} has been added to your client list`,
      });
  
      navigate("/app/clients");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast({
        variant: "destructive",
        title: "Failed to add client",
        description: errorMessage,
      });
    }
  };
  

  const handleMeasurementChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      measurements: {
        ...formData.measurements,
        [field]: value
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/app/clients")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Add New Client</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter client's full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="923001234567"
                value={formData.phone_no}
                onChange={(e) => setFormData({...formData, phone_no: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Street address, city, state, zip code"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the client..."
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Optional Note about measurements */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Ruler className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Measurements can be added later when creating orders</p>
              <p className="text-xs mt-1">You can always edit client details and add measurements anytime</p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <Button 
            type="button"
            variant="outline" 
            className="flex-1"
            onClick={() => navigate("/app/clients")}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Client
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;