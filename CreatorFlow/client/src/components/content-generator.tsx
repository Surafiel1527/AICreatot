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

  const favoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorited }: { id: string; isFavorited: boolean }) => {
      const response = await apiRequest("PATCH", `/api/content-ideas/${id}`, { isFavorited });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-ideas"] });
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
            className="w-full bg-gradient-to-r from-primary to-secondary text-white"
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

        {/* Generated Ideas */}
        {contentIdeas && contentIdeas.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Generated Content Ideas</h3>
              <Badge variant="outline" data-testid="ideas-count">
                {contentIdeas.length} ideas
              </Badge>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contentIdeas.map((idea: any) => (
                <div key={idea.id} className="border border-border rounded-lg p-4 hover-lift" data-testid={`idea-${idea.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <i className={`fab fa-${idea.platform} ${
                        idea.platform === 'youtube' ? 'text-red-600' :
                        idea.platform === 'tiktok' ? 'text-black' :
                        'text-pink-600'
                      }`}></i>
                      <span className="font-medium text-sm capitalize">{idea.platform} Content</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="text-success border-success/20 bg-success/10">
                        High Potential
                      </Badge>
                      <button 
                        onClick={() => favoriteMutation.mutate({ id: idea.id, isFavorited: !idea.isFavorited })}
                        className="p-1 hover:bg-muted rounded"
                        data-testid={`button-favorite-${idea.id}`}
                      >
                        <i className={`fas fa-heart ${idea.isFavorited ? 'text-primary' : 'text-muted-foreground'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-foreground mb-2" data-testid={`idea-title-${idea.id}`}>
                    {idea.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`idea-description-${idea.id}`}>
                    {idea.description}
                  </p>
                  
                  {idea.hashtags && idea.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.hashtags.slice(0, 4).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-accent/10 text-accent border-accent/20">
                          {tag}
                        </Badge>
                      ))}
                      {idea.hashtags.length > 4 && (
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          +{idea.hashtags.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {idea.estimatedViews && (
                        <span data-testid={`idea-views-${idea.id}`}>
                          <i className="fas fa-eye mr-1"></i>
                          Est. {(idea.estimatedViews / 1000).toFixed(0)}K views
                        </span>
                      )}
                      <span data-testid={`idea-duration-${idea.id}`}>
                        <i className="fas fa-clock mr-1"></i>
                        {idea.duration}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid={`button-use-idea-${idea.id}`}
                    >
                      Use This Idea
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
