import { PerformanceChart } from "@/components/analytics/performance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <PerformanceChart />
      
      {/* Content Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-folder text-secondary mr-2"></i>
            Content Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid="library-videos">
              <div className="flex items-center space-x-3">
                <i className="fas fa-file-video text-accent"></i>
                <div>
                  <div className="text-sm font-medium">Draft Videos</div>
                  <div className="text-xs text-muted-foreground">12 items</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-muted-foreground"></i>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid="library-media">
              <div className="flex items-center space-x-3">
                <i className="fas fa-images text-primary"></i>
                <div>
                  <div className="text-sm font-medium">Stock Media</div>
                  <div className="text-xs text-muted-foreground">247 items</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-muted-foreground"></i>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid="library-ideas">
              <div className="flex items-center space-x-3">
                <i className="fas fa-bookmark text-secondary"></i>
                <div>
                  <div className="text-sm font-medium">Saved Ideas</div>
                  <div className="text-xs text-muted-foreground">89 items</div>
                </div>
              </div>
              <i className="fas fa-chevron-right text-muted-foreground"></i>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-brain text-accent mr-2"></i>
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-3">
                <i className="fas fa-lightbulb text-primary mt-1"></i>
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">Trending Opportunity</div>
                  <div className="text-xs text-muted-foreground">
                    "Self-care Sunday" content is trending. Perfect time to share your wellness routine!
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-4 rounded-lg border border-secondary/20">
              <div className="flex items-start space-x-3">
                <i className="fas fa-clock text-secondary mt-1"></i>
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">Optimal Timing</div>
                  <div className="text-xs text-muted-foreground">
                    Post your next TikTok at 7 PM today for maximum reach based on your audience.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" className="w-full mt-4 text-accent hover:text-secondary" data-testid="button-more-suggestions">
            Get More Suggestions <i className="fas fa-arrow-right ml-1"></i>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
