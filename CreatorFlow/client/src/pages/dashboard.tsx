import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentGenerator } from "@/components/content-generator";
import { VideoCreator } from "@/components/video-creator";
import { HashtagGenerator } from "@/components/hashtag-generator";
import { ContentCalendar } from "@/components/content-calendar";
import { AnalyticsSection } from "@/components/analytics-section";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: platformStats } = useQuery({
    queryKey: ["/api/platform-stats"],
    retry: false,
  });

  const { data: contentIdeas } = useQuery({
    queryKey: ["/api/content-ideas"],
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
            <i className="fas fa-bolt text-white text-lg"></i>
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const mockStats = {
    ideasGenerated: contentIdeas?.length || 0,
    viralPosts: 43,
    totalEngagement: "2.4M",
    followerGrowth: "+15.2K"
  };

  const mockPlatformStats = platformStats || [
    { platform: 'youtube', followers: 125000 },
    { platform: 'tiktok', followers: 89000 },
    { platform: 'instagram', followers: 67000 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-white text-lg"></i>
              </div>
              <span className="font-display font-bold text-xl text-foreground">CreatorBoost</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Dashboard</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Content Ideas</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Templates</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Analytics</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors" data-testid="button-notifications">
                <i className="fas fa-bell text-lg"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover" 
                  data-testid="img-profile"
                />
                <span className="hidden sm:block text-sm font-medium" data-testid="text-username">
                  {user?.firstName || 'Creator'}
                </span>
                <button 
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-logout"
                >
                  <i className="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden lg:block">
          <div className="p-6">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Quick Create</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-generate-ideas">
                    <i className="fas fa-lightbulb mr-3"></i>
                    Generate Ideas
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-trending-tags">
                    <i className="fas fa-hashtag text-accent mr-3"></i>
                    Trending Tags
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-ai-video">
                    <i className="fas fa-video text-secondary mr-3"></i>
                    AI Video
                  </Button>
                </div>
              </div>
              
              {/* Platform Stats */}
              <div>
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Your Platforms</h3>
                <div className="space-y-3">
                  {mockPlatformStats.map((stat: any) => (
                    <div key={stat.platform} className="flex items-center justify-between p-3 rounded-lg bg-muted" data-testid={`platform-${stat.platform}`}>
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
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white py-12 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
                Create Viral Content with AI
              </h1>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Generate trending ideas, keywords, and hashtags for YouTube, TikTok, and Instagram. 
                Boost your engagement with AI-powered content creation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" data-testid="button-generate-content">
                  <i className="fas fa-magic mr-2"></i>Generate Content Now
                </Button>
                <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-watch-demo">
                  <i className="fas fa-play mr-2"></i>Watch Demo
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ideas Generated</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="stat-ideas-generated">{mockStats.ideasGenerated}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
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
                      <p className="text-2xl font-bold text-foreground" data-testid="stat-viral-posts">{mockStats.viralPosts}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-lg flex items-center justify-center">
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
                      <p className="text-2xl font-bold text-foreground" data-testid="stat-engagement">{mockStats.totalEngagement}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-success to-accent rounded-lg flex items-center justify-center">
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
                      <p className="text-2xl font-bold text-foreground" data-testid="stat-follower-growth">{mockStats.followerGrowth}</p>
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

            {/* Content Generation Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <ContentGenerator />
              </div>
              
              <div className="space-y-6">
                <HashtagGenerator />
              </div>
            </div>

            {/* Video Creator */}
            <VideoCreator />

            {/* Analytics and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <AnalyticsSection />
              </div>
              <div>
                <ContentCalendar />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          <button className="flex flex-col items-center py-3 px-2 text-primary" data-testid="mobile-nav-home">
            <i className="fas fa-home text-lg mb-1"></i>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors" data-testid="mobile-nav-generate">
            <i className="fas fa-lightbulb text-lg mb-1"></i>
            <span className="text-xs">Generate</span>
          </button>
          <button className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors" data-testid="mobile-nav-create">
            <i className="fas fa-video text-lg mb-1"></i>
            <span className="text-xs">Create</span>
          </button>
          <button className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors" data-testid="mobile-nav-analytics">
            <i className="fas fa-chart-line text-lg mb-1"></i>
            <span className="text-xs">Analytics</span>
          </button>
          <button className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors" data-testid="mobile-nav-profile">
            <i className="fas fa-user text-lg mb-1"></i>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
