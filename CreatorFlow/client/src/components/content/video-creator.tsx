import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface VideoForm {
  topic: string;
  style: string;
  duration: string;
  platform: string;
  aspectRatio: string;
  outline?: string;
}

export function VideoCreator() {
  const [formData, setFormData] = useState<VideoForm>({
    topic: "",
    style: "Tutorial",
    duration: "30 seconds",
    platform: "tiktok",
    aspectRatio: "9:16 (TikTok/Reels)",
    outline: ""
  });

  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);

  const { toast } = useToast();

  const { data: mediaResults, refetch: searchMedia } = useQuery({
    queryKey: ["/api/media/content-creation", formData.topic, formData.platform],
    enabled: false,
  });

  const generateScriptMutation = useMutation({
    mutationFn: async (data: VideoForm) => {
      const response = await apiRequest("POST", "/api/video-content", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedScript(data);
      toast({
        title: "Script Generated!",
        description: "Your video script is ready for review.",
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
        description: "Failed to generate script. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateScript = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a video topic.",
        variant: "destructive",
      });
      return;
    }
    
    generateScriptMutation.mutate(formData);
  };

  const handleCreateVideo = async () => {
    if (!generatedScript) {
      toast({
        title: "Script Required",
        description: "Please generate a script first.",
        variant: "destructive",
      });
      return;
    }

    // Search for media based on the topic
    if (formData.topic) {
      await searchMedia();
    }
    
    toast({
      title: "Video Creation Started!",
      description: "We're finding the perfect media for your video...",
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-video text-accent mr-3"></i>
            AI Video Creator
          </div>
          <Badge className="bg-secondary/10 text-secondary border-secondary/20">
            <i className="fas fa-wand-magic-sparkles mr-1"></i>Beta
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleGenerateScript} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video-topic">Video Topic</Label>
                  <Input
                    id="video-topic"
                    placeholder="e.g., Morning skincare routine"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    data-testid="input-video-topic"
                  />
                </div>
                <div>
                  <Label htmlFor="video-style">Video Style</Label>
                  <Select 
                    value={formData.style} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}
                  >
                    <SelectTrigger data-testid="select-video-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Comedy">Comedy</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="outline">Script Outline</Label>
                <Textarea
                  id="outline"
                  placeholder="Describe your video concept, key points, or let AI generate the script..."
                  className="resize-none h-24"
                  value={formData.outline}
                  onChange={(e) => setFormData(prev => ({ ...prev, outline: e.target.value }))}
                  data-testid="textarea-outline"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="15 seconds">15 seconds</SelectItem>
                      <SelectItem value="30 seconds">30 seconds</SelectItem>
                      <SelectItem value="60 seconds">60 seconds</SelectItem>
                      <SelectItem value="3 minutes">3 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                  <Select 
                    value={formData.aspectRatio} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, aspectRatio: value }))}
                  >
                    <SelectTrigger data-testid="select-aspect-ratio">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:16 (TikTok/Reels)">9:16 (TikTok/Reels)</SelectItem>
                      <SelectItem value="16:9 (YouTube)">16:9 (YouTube)</SelectItem>
                      <SelectItem value="1:1 (Instagram Post)">1:1 (Instagram Post)</SelectItem>
                      <SelectItem value="4:5 (Instagram Story)">4:5 (Instagram Story)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button 
                  type="submit"
                  variant="outline"
                  className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  disabled={generateScriptMutation.isPending}
                  data-testid="button-generate-script"
                >
                  {generateScriptMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-text mr-2"></i>Generate Script
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  onClick={handleCreateVideo}
                  className="flex-1 gradient-success text-white"
                  disabled={!generatedScript}
                  data-testid="button-create-video"
                >
                  <i className="fas fa-video mr-2"></i>Create Video
                </Button>
              </div>
            </form>
          </div>
          
          {/* Video Preview */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-display font-semibold text-lg mb-4 text-center">Video Preview</h3>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <i className="fas fa-play-circle text-4xl text-muted-foreground mb-2"></i>
                <p className="text-sm text-muted-foreground">Preview will appear here</p>
                <p className="text-xs text-muted-foreground mt-1">Generate content to see preview</p>
              </div>
            </div>
            
            {/* Video Controls Preview */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button size="sm" className="w-8 h-8 p-0 rounded-full" data-testid="button-play-preview">
                  <i className="fas fa-play text-xs"></i>
                </Button>
                <span className="text-sm text-muted-foreground">0:00 / 0:30</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="p-2" data-testid="button-download-video">
                  <i className="fas fa-download text-muted-foreground"></i>
                </Button>
                <Button variant="ghost" size="sm" className="p-2" data-testid="button-edit-video">
                  <i className="fas fa-edit text-muted-foreground"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Script Display */}
        {generatedScript && (
          <div className="mt-6 p-4 border border-border rounded-lg" data-testid="generated-script">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Generated Script</h3>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Script Ready
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                <p className="font-medium" data-testid="script-title">{generatedScript.title}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Script</Label>
                <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap" data-testid="script-content">{generatedScript.script}</p>
                </div>
              </div>
              
              {generatedScript.keyPoints && generatedScript.keyPoints.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Key Points</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {generatedScript.keyPoints.map((point: string, index: number) => (
                      <li key={index} data-testid={`key-point-${index}`}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Results */}
        {mediaResults && (
          <div className="mt-6" data-testid="media-results">
            <h3 className="font-semibold text-lg mb-4">Suggested Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaResults.images?.slice(0, 8).map((media: any, index: number) => (
                <div 
                  key={index} 
                  className="relative group cursor-pointer hover-lift"
                  onClick={() => setSelectedMedia(prev => [...prev, media])}
                  data-testid={`media-${index}`}
                >
                  <img 
                    src={media.thumbnailUrl} 
                    alt="Content Media" 
                    className="w-full h-24 object-cover rounded-lg" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                    <i className="fas fa-plus text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                  <Badge className="absolute top-2 left-2 text-xs bg-white/90 text-black">
                    {media.source}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
