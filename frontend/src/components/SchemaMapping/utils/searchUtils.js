export const createSearchIndex = (columns) => {
  return columns.reduce((acc, column) => {
    const searchableText = `${column.name} ${column.type} ${column.description || ''}`.toLowerCase();
    acc.set(column.id, searchableText);
    return acc;
  }, new Map());
};

export const searchColumns = (searchTerm, searchIndex, columns) => {
  const term = searchTerm.toLowerCase();
  return columns.filter(column => 
    searchIndex.get(column.id).includes(term)
  );
};
