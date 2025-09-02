export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden">
      <div className="grid grid-cols-5 gap-1 p-2">
        <button 
          className="flex flex-col items-center py-3 px-2 text-primary"
          onClick={() => window.location.href = '/'}
          data-testid="mobile-nav-home"
        >
          <i className="fas fa-home text-lg mb-1"></i>
          <span className="text-xs">Home</span>
        </button>
        <button 
          className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors"
          onClick={() => window.location.href = '/content-generator'}
          data-testid="mobile-nav-generate"
        >
          <i className="fas fa-lightbulb text-lg mb-1"></i>
          <span className="text-xs">Generate</span>
        </button>
        <button 
          className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors"
          onClick={() => window.location.href = '/video-creator'}
          data-testid="mobile-nav-create"
        >
          <i className="fas fa-video text-lg mb-1"></i>
          <span className="text-xs">Create</span>
        </button>
        <button 
          className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors" 
          data-testid="mobile-nav-analytics"
        >
          <i className="fas fa-chart-line text-lg mb-1"></i>
          <span className="text-xs">Analytics</span>
        </button>
        <button 
          className="flex flex-col items-center py-3 px-2 text-muted-foreground hover:text-primary transition-colors" 
          data-testid="mobile-nav-profile"
        >
          <i className="fas fa-user text-lg mb-1"></i>
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}
