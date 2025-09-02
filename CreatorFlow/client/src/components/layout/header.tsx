import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-bolt text-white text-lg"></i>
            </div>
            <span className="font-display font-bold text-xl text-foreground">CreatorBoost</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="nav-dashboard">
              Dashboard
            </a>
            <a href="/content-generator" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-content-ideas">
              Content Ideas
            </a>
            <a href="/video-creator" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-video-creator">
              Video Creator
            </a>
            <a href="#analytics" className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-analytics">
              Analytics
            </a>
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
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
                className="text-xs text-muted-foreground hover:text-foreground"
                data-testid="button-logout"
              >
                <i className="fas fa-chevron-down"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
