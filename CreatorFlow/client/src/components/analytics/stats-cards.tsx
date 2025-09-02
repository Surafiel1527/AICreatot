import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export function StatsCards() {
  const { data: contentIdeas } = useQuery({
    queryKey: ["/api/content-ideas"],
    retry: false,
  });

  const { data: platformStats } = useQuery({
    queryKey: ["/api/platform-stats"],
    retry: false,
  });

  const stats = {
    ideasGenerated: contentIdeas?.length || 0,
    viralPosts: 43,
    totalEngagement: "2.4M",
    followerGrowth: "+15.2K"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ideas Generated</p>
              <p className="text-2xl font-bold text-foreground" data-testid="stat-ideas-generated">
                {stats.ideasGenerated}
              </p>
            </div>
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-lightbulb text-white"></i>
            </div>
          </div>
          <div className="flex items-center mt-2 text-success text-sm">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>+12% this month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Viral Posts</p>
              <p className="text-2xl font-bold text-foreground" data-testid="stat-viral-posts">
                {stats.viralPosts}
              </p>
            </div>
            <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center">
              <i className="fas fa-fire text-white"></i>
            </div>
          </div>
          <div className="flex items-center mt-2 text-success text-sm">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>+8% this week</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Engagement</p>
              <p className="text-2xl font-bold text-foreground" data-testid="stat-engagement">
                {stats.totalEngagement}
              </p>
            </div>
            <div className="w-12 h-12 gradient-success rounded-lg flex items-center justify-center">
              <i className="fas fa-heart text-white"></i>
            </div>
          </div>
          <div className="flex items-center mt-2 text-success text-sm">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>+23% this month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Follower Growth</p>
              <p className="text-2xl font-bold text-foreground" data-testid="stat-follower-growth">
                {stats.followerGrowth}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-white"></i>
            </div>
          </div>
          <div className="flex items-center mt-2 text-success text-sm">
            <i className="fas fa-arrow-up mr-1"></i>
            <span>+18% this month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
