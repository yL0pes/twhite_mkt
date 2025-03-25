
import { Header } from '@/components/Header';
import { NewTaskForm } from '@/components/NewTaskForm';
import { useTasks } from '@/lib/store';

const Tasks = () => {
  const { addTask } = useTasks();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <NewTaskForm onCreateTask={addTask} />
        </div>
      </main>
    </div>
  );
};

export default Tasks;
