import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Spinner from "@/components/Spinner";

const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

const EditMessageTemplate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewText, setPreviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTemplateGet = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${SERVER_DOMAIN}/msgtemp/get`, {
        withCredentials: true,
      });
      setTemplates(res.data.templates);
      setSelectedTemplate(res.data.templates?.[0] || null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fetch failed",
        description: error.response?.data?.message || "Failed to fetch templates",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;

    try {
      await axios.put(
        `${SERVER_DOMAIN}/msgtemp/${selectedTemplate.id}`,
        {
          name: selectedTemplate.name,
          template: selectedTemplate.template,
        },
        { withCredentials: true }
      );

      toast({
        title: "Message template saved!",
        description: "Your default message template has been updated",
      });

      navigate("/app/settings");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const generatePreview = () => {
    if (!selectedTemplate) return;

    const preview = selectedTemplate.template
      .replace(/\[Customer Name\]/g, "Zoey")
      .replace(/\[Business Name\]/g, "ABC Shop")
      .replace(/\[Item\]/g, "Wedding Dress")
      .replace(/\[Date\]/g, "January 25, 2024")
      .replace(/\[Time\]/g, "2:00 PM");

    setPreviewText(preview);
  };

  const handleChange = (e) => {
    if (!selectedTemplate) return;
    setSelectedTemplate({
      ...selectedTemplate,
      template: e.target.value,
    });
  };

  const useTemplate = (templateObj) => {
    setSelectedTemplate(templateObj);
    setPreviewText("");
  };

  useEffect(() => {
    handleTemplateGet();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/settings")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Message Template</h1>
          <p className="text-muted-foreground">Customize your default customer messages</p>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Custom Message Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Message Template</Label>
                  <Textarea
                    id="template"
                    rows={4}
                    value={selectedTemplate.template}
                    onChange={handleChange}
                    placeholder="Enter your custom message template..."
                  />
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Available placeholders:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><code>[Customer Name]</code> - Customer's full name</li>
                    <li><code>[Business Name]</code> - Your business name</li>
                    <li><code>[Item]</code> - Order item/garment type</li>
                    <li><code>[Date]</code> - Appointment or delivery date</li>
                    <li><code>[Time]</code> - Appointment time</li>
                  </ul>
                </div>

                <Button
                  variant="outline"
                  onClick={generatePreview}
                  className="w-full flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview Message</span>
                </Button>

                {previewText && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="font-medium text-sm mb-2">Preview:</p>
                    <p className="text-sm">{previewText}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Template Presets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Choose from these pre-made templates or use them as inspiration
              </p>

              {templates.map((template) => (
                <div key={template.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{template.name}</h4>
                    <Button variant="outline" size="sm" onClick={() => useTemplate(template)}>
                      Use Template
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.template}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Message Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Keep messages clear and professional</li>
                <li>• Include your business name for brand recognition</li>
                <li>• Use placeholders to personalize messages automatically</li>
                <li>• Consider adding pickup hours or contact information</li>
                <li>• Test messages with the preview feature before saving</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/app/settings")}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Save Template
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EditMessageTemplate;
