import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-white text-lg"></i>
              </div>
              <span className="font-display font-bold text-xl text-foreground">CreatorBoost</span>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-login"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="font-display font-bold text-4xl md:text-6xl mb-6">
            Create Viral Content with AI
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Generate trending ideas, keywords, and hashtags for YouTube, TikTok, and Instagram. 
            Boost your engagement with AI-powered content creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3"
              data-testid="button-get-started"
            >
              <i className="fas fa-magic mr-2"></i>Generate Content Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3"
              data-testid="button-watch-demo"
            >
              <i className="fas fa-play mr-2"></i>Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Everything You Need to Go Viral
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional content creation tools powered by AI to help you create engaging content 
              that your audience will love.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-lightbulb text-white text-xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">AI Content Ideas</h3>
                <p className="text-muted-foreground">
                  Generate endless viral content ideas tailored to your niche and audience.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-hashtag text-white text-xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Smart Hashtags</h3>
                <p className="text-muted-foreground">
                  Get trending hashtags and keywords optimized for maximum reach.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-success to-accent rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-video text-white text-xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">AI Video Creator</h3>
                <p className="text-muted-foreground">
                  Create professional videos with AI-generated scripts and stock media.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Track your content performance and optimize for better results.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-success rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-calendar text-white text-xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Content Calendar</h3>
                <p className="text-muted-foreground">
                  Plan and schedule your content across all platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-users text-white text-xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Creator Community</h3>
                <p className="text-muted-foreground">
                  Connect with fellow creators and share best practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Built for Every Platform
            </h2>
            <p className="text-lg text-muted-foreground">
              Create platform-specific content optimized for maximum engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover-lift">
              <CardContent className="pt-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-lg flex items-center justify-center">
                  <i className="fab fa-youtube text-red-600 text-3xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">YouTube</h3>
                <p className="text-muted-foreground mb-4">
                  Long-form content, thumbnails, and SEO-optimized titles.
                </p>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Video Content
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift">
              <CardContent className="pt-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-lg flex items-center justify-center">
                  <i className="fab fa-tiktok text-black text-3xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">TikTok</h3>
                <p className="text-muted-foreground mb-4">
                  Short-form vertical videos with trending sounds and effects.
                </p>
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  Viral Content
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center hover-lift">
              <CardContent className="pt-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-50 rounded-lg flex items-center justify-center">
                  <i className="fab fa-instagram text-pink-600 text-3xl"></i>
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Instagram</h3>
                <p className="text-muted-foreground mb-4">
                  Stories, reels, and posts optimized for visual engagement.
                </p>
                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                  Visual Content
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
            Ready to Create Viral Content?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of creators who are already using AI to boost their content performance.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg"
            data-testid="button-start-creating"
          >
            Start Creating Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-white text-lg"></i>
              </div>
              <span className="font-display font-bold text-xl text-foreground">CreatorBoost</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 CreatorBoost. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
