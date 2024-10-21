import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Link, Alert } from '@mui/material';

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
  { field: 'rowCount', headerName: '# Rows', type: 'number', width: 100 },
  { field: 'tableCount', headerName: '# Tables', type: 'number', width: 100 },
  { field: 'columnCount', headerName: '# Columns', type: 'number', width: 100 },
  { field: 'assignedResourceCount', headerName: 'Assigned Resources', type: 'number', width: 150 },
  { field: 'createdDate', headerName: 'Created Date', type: 'date', width: 150 },
  { field: 'createdBy', headerName: 'Created By', width: 150 },
];

const DataDictionaryAssignment = ({ onSelect, onCreateNew }) => {
  const [dataDictionaries, setDataDictionaries] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataDictionaries = async () => {
        try {
          const response = await fetch('/api/data-dictionaries');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
      
            // Handle case where data is null or not an array
            if (!data || !Array.isArray(data)) {
              setDataDictionaries([]);
            } else {
              setDataDictionaries(data);
            }
          } else {
            throw new Error('Received non-JSON response from server');
          }
        } catch (e) {
          console.warn('Error fetching data dictionaries:', e);
          setError(`Failed to load data dictionaries: ${e.message}`);
          setDataDictionaries([]);  // Ensure we set it to an empty array in case of error
        }
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


//   if (error) {
//     return <Alert severity="error">{error}</Alert>;
//   }

  const NoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom>
        No existing data dictionaries present.
      </Typography>
      <Link
        component="button"
        variant="body1"
        onClick={() => onCreateNew()}
      >
        Click here to create a new data dictionary
      </Link>
    </Box>
  );

  return (
    <Box sx={{ mt:-2, height: 300, width: '100%' }}>
      <Typography variant="h7" gutterBottom>
        Select a Data Dictionary
      </Typography>
      <DataGrid
        rows={dataDictionaries}
        columns={columns}
        autoPageSize
        rowsPerPageOptions={[10, 25, 50]}
        columnHeaderHeight={40}
        rowHeight={40}
        density="compact"
        checkboxSelection
        disableMultipleSelection
        onSelectionModelChange={handleSelectionChange}
        selectionModel={selectedDictionary ? [selectedDictionary.id] : []}
        components={{
          NoRowsOverlay: NoRowsOverlay,
        }}
      />
    </Box>
  );
};

export default DataDictionaryAssignment;
