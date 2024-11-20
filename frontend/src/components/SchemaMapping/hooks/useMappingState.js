import { useState, useCallback } from 'react';

export const useMappingState = (initialMappings = new Map()) => {
  const [mappings, setMappings] = useState(initialMappings);
  const [history, setHistory] = useState([]);

  const updateMapping = useCallback((sourceId, targetId, confidence) => {
    setHistory(prev => [...prev, new Map(mappings)]);
    const newMappings = new Map(mappings);
    newMappings.set(sourceId, {
      sourceId,
      targetId,
      confidence,
      timestamp: new Date().toISOString()
    });
    setMappings(newMappings);
  }, [mappings]);

  const undoMapping = useCallback(() => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setMappings(previousState);
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history]);

  const clearMappings = useCallback(() => {
    setHistory(prev => [...prev, new Map(mappings)]);
    setMappings(new Map());
  }, [mappings]);

  return {
    mappings,
    updateMapping,
    undoMapping,
    clearMappings,
    hasHistory: history.length > 0
  };
};

export default useMappingState;
