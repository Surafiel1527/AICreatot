import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface HashtagForm {
  contentDescription: string;
  platform: string;
  niche: string;
}

export function HashtagGenerator() {
  const [formData, setFormData] = useState<HashtagForm>({
    contentDescription: "",
    platform: "instagram",
    niche: "lifestyle"
  });

  const { toast } = useToast();

  const { data: trendingTopics } = useQuery({
    queryKey: ["/api/trending-topics", formData.niche],
    enabled: !!formData.niche,
  });

  const [generatedHashtags, setGeneratedHashtags] = useState<any>(null);

  const generateMutation = useMutation({
    mutationFn: async (data: HashtagForm) => {
      const response = await apiRequest("POST", "/api/hashtags", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedHashtags(data);
      toast({
        title: "Hashtags Generated!",
        description: `Generated ${data.tags.length} optimized hashtags.`,
      });
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
        description: "Failed to generate hashtags. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contentDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe your content to generate hashtags.",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate(formData);
  };

  const copyHashtags = () => {
    if (generatedHashtags?.tags) {
      const hashtagText = generatedHashtags.tags.join(' ');
      navigator.clipboard.writeText(hashtagText);
      toast({
        title: "Copied!",
        description: "Hashtags copied to clipboard.",
      });
    }
  };

  const mockTrendingData = [
    { keyword: "#productivity", growth: "+127%" },
    { keyword: "#AI tools", growth: "+89%" },
    { keyword: "#mindfulness", growth: "+76%" },
    { keyword: "#sustainability", growth: "+65%" }
  ];

  return (
    <div className="space-y-6">
      {/* Trending Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-fire text-accent mr-2"></i>
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTrendingData.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`trending-${index}`}>
                <span className="text-sm font-medium">{trend.keyword}</span>
                <span className="text-xs text-success">{trend.growth}</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-primary hover:text-secondary" data-testid="button-view-trends">
            View All Trends <i className="fas fa-arrow-right ml-1"></i>
          </Button>
        </CardContent>
      </Card>

      {/* Hashtag Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Smart Hashtag Generator
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <i className="fas fa-trending-up mr-1"></i>Trending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">Content Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your content to get optimized hashtags..."
                className="resize-none h-20"
                value={formData.contentDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, contentDescription: e.target.value }))}
                data-testid="textarea-description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select 
                  value={formData.platform} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                >
                  <SelectTrigger data-testid="select-platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="niche">Niche</Label>
                <Select 
                  value={formData.niche} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, niche: value }))}
                >
                  <SelectTrigger data-testid="select-niche">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-accent text-white"
              disabled={generateMutation.isPending}
              data-testid="button-generate-hashtags"
            >
              {generateMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-hashtag mr-2"></i>Generate Smart Hashtags
                </>
              )}
            </Button>
          </form>
          
          {/* Generated Hashtags */}
          {generatedHashtags && (
            <div className="bg-muted p-4 rounded-lg mt-4" data-testid="generated-hashtags">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Generated Hashtags</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyHashtags}
                  data-testid="button-copy-hashtags"
                >
                  <i className="fas fa-copy mr-1"></i>Copy All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedHashtags.tags.map((tag: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(tag);
                      toast({ title: "Copied!", description: `${tag} copied to clipboard.` });
                    }}
                    data-testid={`hashtag-${index}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {generatedHashtags.trendingScore && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Trending Score: <span className="text-success font-semibold">{generatedHashtags.trendingScore}/100</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-robot text-secondary mr-2"></i>
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 Based on your recent posts, try creating content about "Daily Routines" - it's trending in your niche!
              </p>
            </div>
            <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
              <p className="text-sm text-foreground">
                🔥 Your cooking content gets 3x more engagement on weekends. Schedule your next recipe video!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
