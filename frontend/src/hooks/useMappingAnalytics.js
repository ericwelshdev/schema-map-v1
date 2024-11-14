import { useState, useEffect } from 'react';

export const useMappingAnalytics = (mappings) => {
  const [analytics, setAnalytics] = useState({
    totalMappings: 0,
    automaticMappings: 0,
    manualMappings: 0,
    averageConfidence: 0,
    unmappedColumns: 0
  });

  useEffect(() => {
    const automaticMappings = mappings.filter(m => !m.manual).length;
    const totalMappings = mappings.length;
    const confidenceSum = mappings.reduce((sum, m) => sum + m.confidence, 0);

    setAnalytics({
      totalMappings,
      automaticMappings,
      manualMappings: totalMappings - automaticMappings,
      averageConfidence: totalMappings ? confidenceSum / totalMappings : 0,
      unmappedColumns: mappings.filter(m => !m.targetId).length
    });
  }, [mappings]);

  return analytics;
};
