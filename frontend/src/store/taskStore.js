import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useTaskStore = create((set) => ({
  tasks: [],
  
  createTask: (taskData) => set((state) => ({
    tasks: [...state.tasks, {
      id: uuidv4(),
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      ...taskData
    }]
  })),
  
  updateTaskStatus: (taskId, status, progress) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === taskId 
        ? { ...task, status, progress: progress ?? task.progress }
        : task
    )
  })),
  
  removeTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== taskId)
  })),
  
  clearCompletedTasks: () => set((state) => ({
    tasks: state.tasks.filter(task => 
      task.status !== 'completed' && task.status !== 'failed'
    )
  }))
}));