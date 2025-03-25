
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { CategoryBlock } from '@/components/CategoryBlock';
import { useTasks, CATEGORIES } from '@/lib/store';

const Index = () => {
  const { tasks, loading, updateTask, deleteTask, getTasksByCategory } = useTasks();

  // Log tasks for debugging
  useEffect(() => {
    console.log('Current tasks:', tasks);
  }, [tasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category, index) => (
              <CategoryBlock
                key={category.id}
                categoryId={category.id}
                tasks={getTasksByCategory(category.id)}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                animationDelay={index}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
