
import { Task, Category, CATEGORIES } from '@/lib/store';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryBlockProps {
  categoryId: Category;
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  onDeleteTask: (id: string) => void;
  animationDelay?: number;
}

export const CategoryBlock = ({
  categoryId,
  tasks,
  onUpdateTask,
  onDeleteTask,
  animationDelay = 0
}: CategoryBlockProps) => {
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === categoryId);
  
  const handleAddTask = () => {
    navigate('/tasks', { state: { preselectedCategory: categoryId } });
  };
  
  return (
    <div 
      className="animate-blur-in" 
      style={{ 
        animationDelay: `${animationDelay * 0.1}s` 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div 
            className={cn(
              "w-3 h-3 rounded-full",
              category?.color || 'bg-gray-500'
            )} 
          />
          <h2 className="text-lg font-medium">{category?.label}</h2>
        </div>
        <button
          onClick={handleAddTask}
          className="p-1 text-muted-foreground hover:text-primary transition-colors rounded-full"
          aria-label={`Add task to ${category?.label}`}
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div className="space-y-3 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="h-[200px] glass rounded-lg flex items-center justify-center text-sm text-muted-foreground">
            No tasks in this category
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              animationDelay={index}
            />
          ))
        )}
      </div>
    </div>
  );
};
