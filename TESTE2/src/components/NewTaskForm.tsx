
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Category, CATEGORIES } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface NewTaskFormProps {
  onCreateTask: (task: { title: string; description: string; category: Category }) => void;
}

export const NewTaskForm = ({ onCreateTask }: NewTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('ACTIONS');
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if a category was preselected (passed via navigation)
    const state = location.state as { preselectedCategory?: Category } | null;
    if (state?.preselectedCategory) {
      setCategory(state.preselectedCategory);
    }
  }, [location.state]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }
    
    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      category,
    });
    
    toast.success('Task created successfully');
    
    // Reset form
    setTitle('');
    setDescription('');
    
    // Navigate back to dashboard
    navigate('/');
  };
  
  return (
    <Card className="glass p-6 max-w-xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-medium mb-6">Create New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Task Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full p-3 rounded-lg border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            className="w-full p-3 rounded-lg border bg-white/50 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Category
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "p-3 rounded-lg border transition-all flex items-center justify-between",
                  category === cat.id 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border bg-white/50 hover:bg-white/80"
                )}
              >
                <span>{cat.label}</span>
                {category === cat.id && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Task
          </button>
        </div>
      </form>
    </Card>
  );
};
