
import { useState, useEffect } from 'react';

export type Category = 'ACTIONS' | 'MARKETING' | 'HR' | 'STORE';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  createdAt: string;
  completed: boolean;
}

// Local storage key
const TASKS_STORAGE_KEY = 'task-manager-tasks';

// Load tasks from localStorage
const loadTasks = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
};

// Save tasks to localStorage
const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

// Custom hook for accessing and manipulating tasks
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks on initial render
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setLoading(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  // Add a new task
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  // Update an existing task
  const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Get tasks by category
  const getTasksByCategory = (category: Category) => {
    return tasks.filter((task) => task.category === category);
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    getTasksByCategory,
  };
};

// Categories data
export const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: 'ACTIONS', label: 'Actions', color: 'bg-blue-500' },
  { id: 'MARKETING', label: 'Marketing', color: 'bg-green-500' },
  { id: 'HR', label: 'HR', color: 'bg-purple-500' },
  { id: 'STORE', label: 'Store', color: 'bg-amber-500' },
];
