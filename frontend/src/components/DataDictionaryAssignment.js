import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'rowCount', headerName: 'Number of Rows', type: 'number', width: 150 },
  { field: 'tableCount', headerName: 'Number of Tables', type: 'number', width: 150 },
  { field: 'columnCount', headerName: 'Number of Columns', type: 'number', width: 150 },
  { field: 'assignedResourceCount', headerName: 'Assigned Resources', type: 'number', width: 150 },
  { field: 'createdDate', headerName: 'Created Date', type: 'date', width: 150 },
  { field: 'createdBy', headerName: 'Created By', width: 150 },
];

const DataDictionaryAssignment = ({ onSelect }) => {
  const [dataDictionaries, setDataDictionaries] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState(null);

  useEffect(() => {
    // Fetch data dictionaries from API
    // This is a placeholder. Replace with actual API call.
    const fetchDataDictionaries = async () => {
      const response = await fetch('/api/data-dictionaries');
      const data = await response.json();
      setDataDictionaries(data);
    };

    fetchDataDictionaries();
  }, []);

  const handleSelectionChange = (newSelection) => {
    if (newSelection.length > 0) {
      const selected = dataDictionaries.find(dd => dd.id === newSelection[0]);
      setSelectedDictionary(selected);
      onSelect(selected);
    } else {
      setSelectedDictionary(null);
      onSelect(null);
    }
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Select a Data Dictionary
      </Typography>
      <DataGrid
        rows={dataDictionaries}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableMultipleSelection
        onSelectionModelChange={handleSelectionChange}
        selectionModel={selectedDictionary ? [selectedDictionary.id] : []}
      />
    </Box>
  );
};

export default DataDictionaryAssignment;