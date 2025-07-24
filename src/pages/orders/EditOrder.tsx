import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { Spin } from "antd";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
// Mock data

const mockOrder = {
  _id: "",
  customerId: "",
  item: "",
  notes: "",
  deliveryDate: "",
  price: "",
  orderStatus: "",
  stitchCategory: "",
  customMeasurements: [],
};

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState(mockOrder);
  const [clients, setClients] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewText, setPreviewText] = useState("");
  const [user, setUser] = useState({});
  const formatDateForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // returns 'YYYY-MM-DD'
  };
  const handleTemplateGet = async () => {
    try {
      const res = await axios.get(`${SERVER_DOMAIN}/msgtemp/get`, {
        withCredentials: true,
      });
      setSelectedTemplate(res.data.templates?.[0] || null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fetch failed",
        description:
          error.response?.data?.message || "Failed to fetch templates",
      });
    }
  };
  const generatePreview = () => {
    if (!selectedTemplate) return;

    const preview = selectedTemplate.template
      .replace(/\[Customer Name\]/g, formData.customerId.name)
      .replace(/\[Item\]/g, formData.item)
      .replace(/\[Business Name\]/g, user.b_name);

    // console.log(preview)
    setPreviewText(preview);
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
      const response = await axios.put(
        `${SERVER_DOMAIN}/order/update/${id}`,
        formData,
        {
          withCredentials: true, // if you're using session-based auth
        }
      );

      toast({
        title: "Order updated successfully!",
        description: "The order changes have been saved",
      });
      if (formData.orderStatus === "Ready") {
        generatePreview();
        console.log(previewText);
        await window.open(
          `https://wa.me/${formData.customerId.phone_no}?text=${previewText}`,
          "_blank"
        );
      }

      navigate("/app/orders");
    } catch (error) {
      console.error("Order update failed:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

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
  const handleOrderGet = async (id: string) => {
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/order/get/${id}`, {
        withCredentials: true, // ensure session-based auth is sent
      });

      const { order, client } = response.data;

      // console.log("Order:", order);
      // console.log("Client:", client);

      // You can now update local state with these details if needed
      setFormData(order);
      // console.log(formData)
    } catch (error) {
      console.error("Failed to fetch order and client details:", error);
      toast({
        variant: "destructive",
        title: "Error fetching order",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };
  const fetchUserDetails = async () => {
    try {
      const response = await axios.post(
        `${SERVER_DOMAIN}/user/details`,
        {},
        { withCredentials: true }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load user details:", error);
    }
  };

  fetchUserDetails();
  useEffect(() => {
    if (id) {
      handleOrderGet(id);
      handleClientGet();
      handleTemplateGet();
      // console.log(user)
      fetchUserDetails();
    }
  }, [id]);
  if (formData.item === "") return <div className="h-screen flex items-center justify-center bg-background p-4"><Spin size="large" /></div>;

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
        <h1 className="text-2xl font-bold">Edit Order #{formData.orderId}</h1>
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
              <Label htmlFor="customer">Customer *</Label>
              <Select
                value={formData.customerId._id}
                onValueChange={(value) =>
                  setFormData({ ...formData, customerId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose customer" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((customer) => (
                    <SelectItem
                      key={customer._id}
                      value={customer._id.toString()}
                    >
                      {customer.name} - {customer.phone_no}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                onChange={(e) =>
                  setFormData({ ...formData, item: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date *</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formatDateForInput(formData.deliveryDate)}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Order Status *</Label>
              <Select
                value={formData.orderStatus}
                onValueChange={(value) =>
                  setFormData({ ...formData, orderStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                placeholder="Special instructions, fabric details, etc."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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
                onValueChange={(value) =>
                  setFormData({ ...formData, stitchCategory: value })
                }
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
                  onClick={() =>
                    setFormData({
                      ...formData,
                      customMeasurements: [
                        ...(formData.customMeasurements || []),
                        { name: "", value: "" },
                      ],
                    })
                  }
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
                      updated[index] = {
                        ...updated[index],
                        name: e.target.value,
                      };
                      setFormData({ ...formData, customMeasurements: updated });
                    }}
                  />
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="Value"
                    value={measurement.value}
                    onChange={(e) => {
                      const updated = [...(formData.customMeasurements || [])];
                      updated[index] = {
                        ...updated[index],
                        value: e.target.value,
                      };
                      setFormData({ ...formData, customMeasurements: updated });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated =
                        formData.customMeasurements?.filter(
                          (_, i) => i !== index
                        ) || [];
                      setFormData({ ...formData, customMeasurements: updated });
                    }}
                  >
                    ×
                  </Button>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom measurements added yet. Click "Add Measurement" to
                  start.
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
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditOrder;
