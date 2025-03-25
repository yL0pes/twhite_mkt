
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutGrid, Plus, ArrowLeft } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const isTasksPage = location.pathname === '/tasks';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300 py-4 px-6",
      scrolled ? "backdrop-blur-md bg-background/70 shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {isTasksPage ? (
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Dashboard
            </button>
          ) : (
            <h1 className="text-xl font-medium flex items-center">
              <LayoutGrid size={20} className="mr-2 text-primary" />
              Task Board
            </h1>
          )}
        </div>
        
        {!isTasksPage && (
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            New Task
          </button>
        )}
      </div>
    </header>
  );
};
