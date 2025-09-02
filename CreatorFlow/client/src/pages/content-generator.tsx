import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ContentGenerator } from "@/components/content/content-generator";
import { HashtagGenerator } from "@/components/content/hashtag-generator";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ContentGeneratorPage() {
  const { isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

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
          <p className="text-muted-foreground">Loading content generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex min-h-screen">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="bg-gradient-to-r from-primary to-secondary text-white py-12 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
                AI Content Generator
              </h1>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Generate viral content ideas with AI. Get trending topics, hashtags, and 
                platform-specific suggestions that drive engagement.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ContentGenerator />
              </div>
              
              <div>
                <HashtagGenerator />
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
