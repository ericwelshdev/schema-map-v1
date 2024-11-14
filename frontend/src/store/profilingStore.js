import { create } from 'zustand';

export const useProfilingStore = create((set) => ({
  profilingResults: {},
  profilingStatus: {},
  
  startProfiling: async (sourceId) => {
    set((state) => ({
      profilingStatus: {
        ...state.profilingStatus,
        [sourceId]: 'running'
      }
    }));
    
    // Profiling logic here
  },
  
  updateProfilingResults: (sourceId, results) => set((state) => ({
    profilingResults: {
      ...state.profilingResults,
      [sourceId]: results
    }
  })),
  
  updateProfilingStatus: (sourceId, status) => set((state) => ({
    profilingStatus: {
      ...state.profilingStatus,
      [sourceId]: status
    }
  }))
}));