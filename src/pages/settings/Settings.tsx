import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Building,
  MessageSquare,
  Edit,
  LogOut,
  Camera,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Spinner from "@/components/Spinner";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
// Mock settings data
const userDetail = {
  logoUrl: "",
  b_name: "",
  name: "",
  email: "",
  phone_no: "",
  address: "",
  website: "",
};

const messageDetail = {
  messaging: "",
  messageType: "sms",
  defaultTemplate:""
};

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState(messageDetail);
  const [user, setUser] = useState(userDetail);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_DOMAIN}/user/details`,
          {},
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to load user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_DOMAIN}/user/update`, user, {
        withCredentials: true,
      });
      toast({
        title: 'Profile updated',
        description: 'Your information has been saved.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Something went wrong.',
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("logo", file);
  
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/user/upload-logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
  
      const { logoUrl } = res.data;
  
      setUser((prev) => ({ ...prev, logoUrl }));
  
      toast({
        title: "Logo uploaded!",
        description: "Your business logo has been updated.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload logo. Try again.",
      });
    }
  };
  

  const handleLogout = async () => {
    await axios.post(
      `${SERVER_DOMAIN}/auth/logout`,
      {},
      {
        withCredentials: true, // ✅ sends session cookie to backend
      }
    );

    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account",
    });

    navigate("/login"); // ✅ redirects to login after logout
  };
  if(user.b_name === "") return <Spinner/>;
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your business preferences and account
        </p>
      </div>

      {/* Business Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Business Logo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
              {user.logoUrl ? (
                <img
                  src={user.logoUrl}
                  alt="Business Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="logo-upload"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: 200x200 pixels, PNG or JPG
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Business Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={user?.b_name?? ""}
                onChange={(e) => setUser({ ...user, b_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                value={user?.name?? ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user?.email?? ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={user?.phone_no?? ""}
                onChange={(e) => setUser({ ...user, phone_no: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                value={user?.website?? ""}
                onChange={(e) => setUser({ ...user, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                rows={3}
                value={user?.address?? ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messaging Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Messaging Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* <div className="space-y-2">
              <Label>Message Type</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred messaging method
              </p>
            </div> */}

            {/* <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="sms"
                  name="messageType"
                  value="sms"
                  checked={message.messageType === "sms"}
                  onChange={(e) =>
                    setMessage({ ...message, messaging: e.target.value })
                  }
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <Label htmlFor="sms" className="text-sm">
                  SMS (Local)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="whatsapp"
                  name="messageType"
                  value="whatsapp"
                  checked={message.messageType === "whatsapp"}
                  onChange={(e) =>
                    setMessage({ ...message, messaging: e.target.value })
                  }
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <Label htmlFor="whatsapp" className="text-sm">
                  WhatsApp
                </Label>
              </div>
            </div> */}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Default Message Template</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/app/settings/message-template")}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Template
              </Button>
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/app/change-password")}
          >
            Change Password
          </Button>

          <Separator />

          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
};

export default Settings;
