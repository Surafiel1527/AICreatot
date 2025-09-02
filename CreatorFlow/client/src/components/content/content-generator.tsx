import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ContentCard } from "./content-card";

interface ContentIdeaForm {
  topic: string;
  platform: string;
  targetAudience: string;
  contentStyle: string;
  duration: string;
  niche: string;
}

export function ContentGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");
  const [formData, setFormData] = useState<ContentIdeaForm>({
    topic: "",
    platform: "youtube",
    targetAudience: "Gen Z (18-24)",
    contentStyle: "Educational",
    duration: "Medium (1-5 min)",
    niche: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contentIdeas, isLoading: loadingIdeas } = useQuery({
    queryKey: ["/api/content-ideas"],
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: async (data: ContentIdeaForm) => {
      const response = await apiRequest("POST", "/api/content-ideas", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Content Ideas Generated!",
        description: "Your new content ideas are ready to use.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content-ideas"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate content ideas. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a content topic.",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate({ ...formData, platform: selectedPlatform });
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setFormData(prev => ({ ...prev, platform }));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AI Content Generator
            <Badge className="bg-primary text-primary-foreground">
              <i className="fas fa-robot mr-1"></i>AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Platform Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => handlePlatformSelect("youtube")}
              className={`platform-card border-2 p-4 rounded-lg transition-colors text-center ${
                selectedPlatform === "youtube" 
                  ? "bg-red-50 border-red-200 hover:bg-red-100" 
                  : "bg-gray-50 border-border hover:bg-gray-100"
              }`}
              data-testid="platform-youtube"
            >
              <i className="fab fa-youtube text-red-600 text-2xl mb-2"></i>
              <div className="font-medium text-sm">YouTube</div>
            </button>
            <button
              onClick={() => handlePlatformSelect("tiktok")}
              className={`platform-card border-2 p-4 rounded-lg transition-colors text-center ${
                selectedPlatform === "tiktok" 
                  ? "bg-gray-50 border-gray-400 hover:bg-gray-100" 
                  : "bg-gray-50 border-border hover:bg-gray-100"
              }`}
              data-testid="platform-tiktok"
            >
              <i className="fab fa-tiktok text-black text-2xl mb-2"></i>
              <div className="font-medium text-sm">TikTok</div>
            </button>
            <button
              onClick={() => handlePlatformSelect("instagram")}
              className={`platform-card border-2 p-4 rounded-lg transition-colors text-center ${
                selectedPlatform === "instagram" 
                  ? "bg-pink-50 border-pink-200 hover:bg-pink-100" 
                  : "bg-gray-50 border-border hover:bg-gray-100"
              }`}
              data-testid="platform-instagram"
            >
              <i className="fab fa-instagram text-pink-600 text-2xl mb-2"></i>
              <div className="font-medium text-sm">Instagram</div>
            </button>
          </div>

          {/* Content Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="topic">Content Topic or Niche</Label>
              <Input
                id="topic"
                placeholder="e.g., Tech reviews, Cooking tips, Fitness routines..."
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                data-testid="input-topic"
              />
            </div>
            
            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Select 
                value={formData.targetAudience} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}
              >
                <SelectTrigger data-testid="select-audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gen Z (18-24)">Gen Z (18-24)</SelectItem>
                  <SelectItem value="Millennials (25-40)">Millennials (25-40)</SelectItem>
                  <SelectItem value="Gen X (41-56)">Gen X (41-56)</SelectItem>
                  <SelectItem value="All Ages">All Ages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="style">Content Style</Label>
                <Select 
                  value={formData.contentStyle} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, contentStyle: value }))}
                >
                  <SelectTrigger data-testid="select-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Inspirational">Inspirational</SelectItem>
                    <SelectItem value="Behind-the-scenes">Behind-the-scenes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={formData.duration} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger data-testid="select-duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short (< 60s)">Short (&lt; 60s)</SelectItem>
                    <SelectItem value="Medium (1-5 min)">Medium (1-5 min)</SelectItem>
                    <SelectItem value="Long (5+ min)">Long (5+ min)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-primary text-white"
              disabled={generateMutation.isPending}
              data-testid="button-generate-ideas"
            >
              {generateMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>Generate Content Ideas
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated Ideas */}
      {contentIdeas && contentIdeas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Content Ideas
              <div className="flex items-center space-x-2">
                <Badge variant="outline" data-testid="ideas-count">
                  {contentIdeas.length} ideas
                </Badge>
                <Button variant="outline" size="sm" data-testid="button-export-ideas">
                  <i className="fas fa-download mr-1"></i>Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contentIdeas.map((idea: any) => (
                <ContentCard key={idea.id} idea={idea} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
