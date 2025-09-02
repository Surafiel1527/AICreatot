import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

export function PerformanceChart() {
  const { data: contentIdeas } = useQuery({
    queryKey: ["/api/content-ideas"],
    retry: false,
  });

  // Mock top performing content based on actual data
  const topContent = contentIdeas?.slice(0, 3).map((idea: any, index: number) => ({
    id: idea.id,
    title: idea.title,
    platform: idea.platform,
    views: idea.estimatedViews || (120000 - index * 30000),
    engagement: idea.estimatedEngagement || `${(8.7 - index * 2).toFixed(1)}%`,
    timeAgo: `${index + 1} day${index === 0 ? '' : 's'} ago`
  })) || [
    {
      id: "1",
      title: "5 Morning Habits That Changed My Life",
      platform: "youtube",
      views: 87000,
      engagement: "4.2% CTR",
      timeAgo: "2 days ago"
    },
    {
      id: "2", 
      title: "POV: You learn this productivity trick",
      platform: "tiktok",
      views: 156000,
      engagement: "8.7% Engagement",
      timeAgo: "1 day ago"
    },
    {
      id: "3",
      title: "Workspace Setup Tour",
      platform: "instagram", 
      views: 23000,
      engagement: "5.1% Engagement",
      timeAgo: "3 days ago"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Content Performance</CardTitle>
          <Select defaultValue="30days">
            <SelectTrigger className="w-[140px]" data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Performance Chart Placeholder */}
        <div className="bg-muted rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">Engagement Rate</span>
            <span className="text-sm text-success font-semibold">+15.3%</span>
          </div>
          <div className="h-32 gradient-primary/20 rounded-lg flex items-end justify-center">
            <div className="text-center">
              <i className="fas fa-chart-line text-2xl text-muted-foreground mb-2"></i>
              <p className="text-xs text-muted-foreground">Performance trends will appear here</p>
            </div>
          </div>
        </div>
        
        {/* Top Performing Content */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">Top Performing Content</h3>
          <div className="space-y-3">
            {topContent.map((content) => (
              <div 
                key={content.id} 
                className="flex items-center space-x-4 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors" 
                data-testid={`top-content-${content.id}`}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <i className={`fab fa-${content.platform} ${
                    content.platform === 'youtube' ? 'text-red-600' :
                    content.platform === 'tiktok' ? 'text-black' :
                    'text-pink-600'
                  }`}></i>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-foreground" data-testid={`content-title-${content.id}`}>
                    {content.title}
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid={`content-platform-${content.id}`}>
                    {content.platform} • {content.timeAgo}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-success" data-testid={`content-views-${content.id}`}>
                    {(content.views / 1000).toFixed(0)}K views
                  </div>
                  <div className="text-xs text-muted-foreground" data-testid={`content-engagement-${content.id}`}>
                    {content.engagement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
