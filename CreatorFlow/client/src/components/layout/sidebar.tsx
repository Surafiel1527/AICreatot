import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export function Sidebar() {
  const { data: platformStats } = useQuery({
    queryKey: ["/api/platform-stats"],
    retry: false,
  });

  const mockPlatformStats = platformStats || [
    { platform: 'youtube', followers: 125000 },
    { platform: 'tiktok', followers: 89000 },
    { platform: 'instagram', followers: 67000 }
  ];

  return (
    <aside className="w-64 bg-card border-r border-border hidden lg:block">
      <div className="p-6">
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Quick Create
            </h3>
            <div className="space-y-2">
              <Button 
                className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={() => window.location.href = '/content-generator'}
                data-testid="button-generate-ideas"
              >
                <i className="fas fa-lightbulb mr-3"></i>
                Generate Ideas
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                data-testid="button-trending-tags"
              >
                <i className="fas fa-hashtag text-accent mr-3"></i>
                Trending Tags
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = '/video-creator'}
                data-testid="button-ai-video"
              >
                <i className="fas fa-video text-secondary mr-3"></i>
                AI Video
              </Button>
            </div>
          </div>
          
          {/* Platform Stats */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Your Platforms
            </h3>
            <div className="space-y-3">
              {mockPlatformStats.map((stat: any) => (
                <div 
                  key={stat.platform} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted" 
                  data-testid={`platform-${stat.platform}`}
                >
                  <div className="flex items-center space-x-2">
                    <i className={`fab fa-${stat.platform} ${
                      stat.platform === 'youtube' ? 'text-red-600' : 
                      stat.platform === 'tiktok' ? 'text-black' : 
                      'text-pink-600'
                    }`}></i>
                    <span className="text-sm font-medium capitalize">{stat.platform}</span>
                  </div>
                  <span className="text-xs text-success font-semibold" data-testid={`followers-${stat.platform}`}>
                    {(stat.followers / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Projects */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Recent
            </h3>
            <div className="space-y-2">
              <div className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer" data-testid="recent-project-1">
                <div className="text-sm font-medium truncate">10 Productivity Hacks</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
              <div className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer" data-testid="recent-project-2">
                <div className="text-sm font-medium truncate">Cooking Tips Series</div>
                <div className="text-xs text-muted-foreground">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
