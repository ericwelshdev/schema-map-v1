import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Link, Alert } from '@mui/material';
import { getResources } from '../services/resourceService';


const ResourceDataDictionaryAssignment = ({ onSelect, onCreateNew }) => {
  const [dataDictionaries, setDataDictionaries] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataDictionaries = async () => {
      try {
        const data = await getResources();
        const dataDictionaries = data.filter(
          resource => ['Data Dictionary', 'Data Dictionary Schema'].includes(resource.dsstrc_attr_grp_src_typ_cd)
        );
        setDataDictionaries(dataDictionaries);
      } catch (error) {
        console.error('Error fetching data dictionaries:', error);
        setError(`Failed to load data dictionaries: ${error.message}`);
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


  const columns = [
    { field: 'dsstrc_attr_grp_id', headerName: 'ID', flex: 1 },
    { field: 'dsstrc_attr_grp_nm', headerName: 'Name', width: 200 },
    { field: 'dsstrc_attr_grp_desc', headerName: 'Description', width: 300 },
    { field: 'rowCount', headerName: '# Rows', type: 'number', width: 100 },
    { field: 'tableCount', headerName: '# Tables', type: 'number', width: 100 },
    { field: 'columnCount', headerName: '# Columns', type: 'number', width: 100 },
    { field: 'assignedResourceCount', headerName: 'Assigned Resources', type: 'number', width: 150 },
    { field: 'cre_ts', headerName: 'Created Date',  width: 150 },
    { field: 'cre_by_nm', headerName: 'Created By', width: 150 },
    { field: 'updt_ts', headerName: 'Last Updated', width: 150 },
  ];

  


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
        getRowId={(row) => row.dsstrc_attr_grp_id}
        components={{
          NoRowsOverlay: NoRowsOverlay,
        }}
      />
    </Box>
  );
};

export default ResourceDataDictionaryAssignment;
