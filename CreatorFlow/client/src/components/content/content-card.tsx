import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContentCardProps {
  idea: any;
}

export function ContentCard({ idea }: ContentCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: async ({ id, isFavorited }: { id: string; isFavorited: boolean }) => {
      const response = await apiRequest("PATCH", `/api/content-ideas/${id}`, { isFavorited });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-ideas"] });
    },
  });

  const useMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await apiRequest("PATCH", `/api/content-ideas/${id}`, { isUsed: true });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Idea Marked as Used!",
        description: "This content idea has been added to your content creation workflow.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content-ideas"] });
    },
  });

  return (
    <div className="border border-border rounded-lg p-5 hover-lift" data-testid={`idea-${idea.id}`}>
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
        {idea.hook && (
          <span className="font-medium">Hook: "{idea.hook}" </span>
        )}
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
          onClick={() => useMutation.mutate({ id: idea.id })}
          disabled={idea.isUsed}
          data-testid={`button-use-idea-${idea.id}`}
        >
          {idea.isUsed ? "Used" : "Use This Idea"}
        </Button>
      </div>
    </div>
  );
}
