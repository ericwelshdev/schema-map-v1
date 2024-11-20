const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return '#4caf50'; // Green for high confidence
  if (confidence >= 0.6) return '#ff9800'; // Orange for medium confidence
  return '#f44336'; // Red for low confidence
};

export const generateMappingLayout = (sourceColumns, targetColumns, mappings) => {
  const mappingsArray = Array.from(mappings.values());
  
  return {
    nodes: [
      ...sourceColumns.map((col, idx) => ({
        id: `source-${col.id}`,
        position: { x: 0, y: idx * 50 },
        data: { label: col.name, type: 'source' }
      })),
      ...targetColumns.map((col, idx) => ({
        id: `target-${col.id}`,
        position: { x: 300, y: idx * 50 },
        data: { label: col.name, type: 'target' }
      }))
    ],
    edges: mappingsArray.map(mapping => ({
      id: `${mapping.sourceId}-${mapping.targetId}`,
      source: `source-${mapping.sourceId}`,
      target: `target-${mapping.targetId}`,
      style: { stroke: getConfidenceColor(mapping.confidence) }
    }))
  };
};