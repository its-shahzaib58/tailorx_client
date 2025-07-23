import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const email = location.state?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
      });
      return;
    }
  
    try {
      const response = await axios.post(`${SERVER_DOMAIN}/auth/verify-otp`, {
        email,
        otp,
      }, { withCredentials: true });
  
      toast({
        title: "Verification successful!",
        description: response.data.message,
      });
  
      navigate("/reset-password");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "OTP Verification Failed",
        description: error.response?.data?.message || "An error occurred",
      });
    }
  };

  const handleResend = async () => {

    try {
      const response = await axios.post(`${SERVER_DOMAIN}/auth/forgot-password`, {
        email,
      },{ withCredentials: true });

      toast({
        title: "OTP Resent!",
        description: "A new verification code has been sent",
      });

      navigate("/otp-verification", { state: { email } });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" className="w-full h-12" disabled={otp.length < 6}>
              Verify Code
            </Button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button 
                onClick={handleResend}
                className="text-primary hover:underline font-medium"
              >
                Resend OTP
              </button>
            </p>
            
            <Link 
              to="/forgot-password" 
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;