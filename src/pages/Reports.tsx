import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  CalendarDays,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Spinner from "@/components/Spinner";
const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Spin } from "antd";
// Mock reports data

const mockReports = {
    totalOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    averageOrderValue: 0,
    newClients: 0,
    returningClients: 0,
    totalDays:0
};
const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
      const startOfYear = new Date(now.getFullYear(), 0, 1) .toISOString()
      .split("T")[0];
      const endOfYear = new Date(now.getFullYear(), 11, 31) .toISOString()
      .split("T")[0];
const Reports = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [startDate, setStartDate] = useState(startOfMonth);
  const [endDate, setEndDate] = useState(endOfMonth);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [data, setData] = useState(mockReports);



// Assume mockReports is coming from your state
const handleExportPDF = () => {
  if (!startDate || !endDate) {
    toast({
      variant: "destructive",
      title: "Date Range Required",
      description: "Please select a date range before exporting",
    });
    return;
  }

  toast({
    title: "PDF Export Started",
    description: `Generating report for ${startDate} to ${endDate}`,
  });

  setTimeout(() => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("TailorX Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 30);

    const tableData = [
      ["Metric", "Value"],
      ["Total Orders", data.totalOrders],
      ["Completed Orders", data.completedOrders],
      ["Total Earnings", data.totalEarnings],
      ["Average Order Value", data.averageOrderValue],
      ["New Clients", data.newClients],
      ["Returning Clients", data.returningClients],
      ["Total Days", data.totalDays],
    ];

    // ✅ Use autoTable
    autoTable(doc, {
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 40,
    });

    doc.save(`TailorX-Report-${startDate}-to-${endDate}.pdf`);

    toast({
      title: "PDF Downloaded",
      description: "Your report has been downloaded successfully",
    });
  }, 1000);
};



  // const data =
  //   selectedPeriod === "current" ? data.monthlyStats : data.yearlyStats;

  const periodLabel = selectedPeriod === "current" ? "This Month" : "This Year";
  console.log(startDate);
  console.log(endDate);
  const getReports = async () => {
    

    if (selectedPeriod == "current") {
      setStartDate(startOfMonth);
      setEndDate(endOfMonth)
    }else if(selectedPeriod == "yearly")
    {
      setStartDate(startOfYear);
      setEndDate(endOfYear)
    }
   
    try {
      const response = await axios.get(`${SERVER_DOMAIN}/general/reports`, {
        withCredentials: true,
        params: {
          startDate, // format: "YYYY-MM-DD"
          endDate,
        },
      });

      // console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // console.log(selectedPeriod)
  useEffect(() => {
    getReports();
  }, [startDate,endDate]);

  if(data.totalOrders == 0 ) return <div className="h-screen flex items-center justify-center bg-background p-4"><Spin size="large" /></div>;
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Business Reports</h1>
        <p className="text-muted-foreground">Track your business performance</p>
      </div>

      {/* Date Range Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarDays className="h-5 w-5" />
            <span>Report Period</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Quick Select</Label>
            <Select
              value={selectedPeriod}
              onValueChange={(value) => {
                setSelectedPeriod(value);
                setIsCustomRange(value === "custom");
                if (value !== "custom") {
                  setStartDate("");
                  setEndDate("");
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  Current Month -{" "}
                  {new Date().toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </SelectItem>
                <SelectItem value="yearly">
                  Year to Date -{" "}
                  {new Date().toLocaleDateString("en-GB", {
                    year: "numeric",
                  })}
                </SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isCustomRange && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {data?.totalOrders ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">{periodLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Orders
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {data?.completedOrders ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (data?.completedOrders / data?.totalOrders) * 100
              )}
              % completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ${data?.totalEarnings.toLocaleString() ?? ""}
            </div>
            <p className="text-xs text-muted-foreground">
              Average: ${data?.averageOrderValue ?? 0} per order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Activity */}
      {selectedPeriod === "current" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Client Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-accent">
                  {data?.newClients ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  New Clients This Month
                </p>
              </div>

              {/* <div className="space-y-2">
                <h4 className="font-medium">Recent Client Activity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm">Sarah Johnson</span>
                    <span className="text-xs text-muted-foreground">Order placed 2 days ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm">Mike Chen</span>
                    <span className="text-xs text-muted-foreground">Measurement taken 1 week ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm">Emma Davis</span>
                    <span className="text-xs text-muted-foreground">Order delivered 3 days ago</span>
                  </div>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order Completion Rate</span>
            <span className="font-semibold">
              {Math.round(
                (data?.completedOrders / data?.totalOrders) * 100
              )}
              %
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Average Order Value</span>
            <span className="font-semibold">
              ${data?.averageOrderValue ?? 0}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              Revenue per Completed Order
            </span>
            <span className="font-semibold">
              $
              {Math.round(
                data?.totalEarnings ?? 0 / data?.completedOrders ?? 0
              )}
            </span>
          </div>

          {selectedPeriod === "current" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Client Retention Rate
                </span>
                <span className="font-semibold">
                  {Math.round(
                    (data?.returningClients  /
                        (data?.newClients + data?.returningClients)) * 100
                  )}
                  %
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Daily Average Orders
                </span>
                <span className="font-semibold">
                  {Math.round(data?.totalOrders  / 31)} orders/day
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Export Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate detailed reports for your records, tax filing, or business
            analysis.
          </p>

          {(!startDate || !endDate) && isCustomRange && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                Please select a date range above to enable PDF export.
              </p>
            </div>
          )}

          <Button
            onClick={handleExportPDF}
            disabled={isCustomRange && (!startDate || !endDate)}
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Detailed PDF Report
            {startDate && endDate && (
              <span className="ml-2 text-xs opacity-75">
                ({startDate} to {endDate})
              </span>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            PDF will include all order details, client information, and
            financial summaries for the selected period.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
