
import { useState } from 'react';
import { Task, CATEGORIES } from '@/lib/store';
import { Check, Trash, Edit, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  onDelete: (id: string) => void;
  animationDelay?: number;
}

export const TaskCard = ({ 
  task, 
  onUpdate, 
  onDelete, 
  animationDelay = 0 
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  
  const category = CATEGORIES.find(c => c.id === task.category);
  const formattedDate = new Date(task.createdAt).toLocaleDateString();
  
  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };
  
  const toggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  return (
    <Card className={cn(
      "glass card-hover p-4 relative overflow-hidden animate-scale-in",
      task.completed ? "opacity-70" : "opacity-100"
    )}
    style={{ 
      animationDelay: `${animationDelay * 0.05}s`,
      transition: 'all 0.3s ease'
    }}>
      <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full opacity-20" 
           style={{ background: category?.color || 'bg-gray-500' }} />
      
      <div className="mb-2">
        <span className={cn(
          "inline-block text-xs font-medium py-1 px-2 rounded-full opacity-90",
          category?.color || 'bg-gray-500',
          "text-white"
        )}>
          {category?.label}
        </span>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-1 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full p-1 border rounded focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleCancel}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={16} />
            </button>
            <button
              onClick={handleSave}
              className="p-1 text-primary hover:text-primary/80 transition-colors"
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className={cn(
            "font-medium leading-tight mb-1 transition-all line-clamp-2",
            task.completed ? "line-through text-muted-foreground" : ""
          )}>
            {task.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {task.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span>{formattedDate}</span>
            <div className="flex space-x-1">
              <button
                onClick={toggleComplete}
                className={cn(
                  "p-1 rounded transition-colors",
                  task.completed 
                    ? "text-green-500 hover:text-green-600" 
                    : "text-gray-400 hover:text-green-500"
                )}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-primary transition-colors"
                aria-label="Edit task"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete task"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
