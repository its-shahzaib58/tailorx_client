import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Ruler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Spinner from "@/components/Spinner";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
// Mock client data
const mockClient = {
  id: "",
  name: "",
  phone_no: "",
  email: "",
  address: "",
  notes: "",
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
};

const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState(mockClient);

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
      await axios.put(`${SERVER_DOMAIN}/client/update/${id}`, formData, {
        withCredentials: true, // for session authentication
      });
  
      toast({
        title: "Client updated successfully!",
        description: `${formData.name}'s information has been saved`,
      });
  
      navigate("/app/clients");
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was a problem updating the client.",
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
    
  const handleClientGet = async (clientId: string) => {
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/client/get/${clientId}`, {
        withCredentials: true, // send session cookie
      });
  
      setFormData(response.data.client); // assuming client is an object
  
      console.log("Client fetched:", response.data.client);
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
  if ( formData.name === "") return <Spinner />;

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
        <h1 className="text-2xl font-bold">Edit Client #{id}</h1>
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
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ruler className="h-5 w-5" />
              <span>Measurements (inches)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chest">Chest</Label>
                <Input
                  id="chest"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={formData.measurements.chest}
                  onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist">Waist</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={formData.measurements.waist}
                  onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hips">Hips</Label>
                <Input
                  id="hips"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={formData.measurements.hips}
                  onChange={(e) => handleMeasurementChange('hips', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shoulders">Shoulders</Label>
                <Input
                  id="shoulders"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={formData.measurements.shoulders}
                  onChange={(e) => handleMeasurementChange('shoulders', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="armLength">Arm Length</Label>
                <Input
                  id="armLength"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={formData.measurements.armLength}
                  onChange={(e) => handleMeasurementChange('armLength', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalLength">Total Length</Label>
                <Input
                  id="totalLength"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={formData.measurements.totalLength}
                  onChange={(e) => handleMeasurementChange('totalLength', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neck">Neck</Label>
                <Input
                  id="neck"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={formData.measurements.neck}
                  onChange={(e) => handleMeasurementChange('neck', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inseam">Inseam</Label>
                <Input
                  id="inseam"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={formData.measurements.inseam}
                  onChange={(e) => handleMeasurementChange('inseam', e.target.value)}
                />
              </div>
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
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditClient;