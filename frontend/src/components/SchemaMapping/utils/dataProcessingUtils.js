const getValuePattern = (value) => {
  if (value === null || value === undefined) return 'NULL';
  
  const patterns = {
    number: /^\d+$/,
    decimal: /^\d*\.\d+$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?\d{10,}$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    text: /^[a-zA-Z\s]+$/
  };

  for (const [type, regex] of Object.entries(patterns)) {
    if (regex.test(value)) return type;
  }

  return 'other';
};

const calculateDistribution = (values) => {
  const distribution = values.reduce((acc, value) => {
    const key = value === null ? 'null' : typeof value;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(distribution).map(([category, count]) => ({
    category,
    count,
    percentage: (count / values.length) * 100
  }));
};

export const processColumnData = (columnData) => {
  const stats = {
    totalCount: columnData.length,
    nullCount: 0,
    distinctCount: new Set(columnData).size,
    patterns: detectPatterns(columnData),
    distribution: calculateDistribution(columnData)
  };

  return {
    ...stats,
    nullRate: (stats.nullCount / stats.totalCount) * 100,
    distinctRate: (stats.distinctCount / stats.totalCount) * 100
  };
};

export const detectPatterns = (values) => {
  const patterns = values.reduce((acc, value) => {
    const pattern = getValuePattern(value);
    acc[pattern] = (acc[pattern] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(patterns)
    .map(([pattern, count]) => ({
      pattern,
      count,
      percentage: (count / values.length) * 100
    }))
    .sort((a, b) => b.count - a.count);
};
