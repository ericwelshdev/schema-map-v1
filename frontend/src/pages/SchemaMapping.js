import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import SidebarPanel from '../components/SchemaMapping/Sidebar/SidebarPanel';
import ToolbarContainer from '../components/SchemaMapping/Toolbars/ToolbarContainer';
import MappingGrid from '../components/SchemaMapping/Grid/MappingGrid';
import DataPreviewDialog from '../components/SchemaMapping/Dialogs/DataPreviewDialog';
import MappingSuggestionsDialog from '../components/SchemaMapping/Dialogs/MappingSuggestionsDialog';
import ValidationResultsDialog from '../components/SchemaMapping/Dialogs/ValidationResultsDialog';
import DataProfileDialog from '../components/SchemaMapping/Dialogs/DataProfileDialog';
import MappingDetails from '../components/SchemaMapping/Details/MappingDetails';

import { useMappingState } from '../components/SchemaMapping/hooks/useMappingState';
import { useValidation } from '../components/SchemaMapping/hooks/useValidation';
import { useTransformation } from '../components/SchemaMapping/hooks/useTransformation';
import { getResourceAttributesByGroupId } from '../services/resourceAttributeService';
import { getResourceAttributeAssociationsByGroupId } from '../services/resourceAttributeAssociationService';
import { createSearchIndex, searchColumns } from '../components/SchemaMapping/utils/searchUtils';

// import {
//   mockTargetSchema,
//   mockMappingSuggestions,
//   mockValidationResults,
//   mockSampleData,
//   mockColumnProfile
// } from '../components/SchemaMapping/mockData/schemaMappingData';

const SchemaMapping = () => {
  const { mappings, updateMapping } = useMappingState();
  const { validationResults, validateMapping } = useValidation();
  const { transformations, applyTransformation } = useTransformation();
  
  const [sourceColumns, setSourceColumns] = useState([]);
  const [targetColumns, setTargetColumns] = useState([]);
  const [mappingColumns, setMappingColumns] = useState(null);
  const [filteredSourceColumns, setFilteredSourceColumns] = useState([]);
  const [filteredTargetColumns, setFilteredTargetColumns] = useState(null);
  const [filteredMappingColumns, setFilteredMappingColumns] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [activeView, setActiveView] = useState('grid');
  const [activeDialog, setActiveDialog] = useState(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  
  const [searchIndex] = useState(() => 
    createSearchIndex([...sourceColumns, ...targetColumns])
  );

  useEffect(() => {
    const fetchSourceColumns = async () => {
      setIsLoading(true);
      try {
        const columns = await getResourceAttributesByGroupId('7818');
        console.log('Fetched Source Columns:', columns);
        setSourceColumns(columns);
        setFilteredSourceColumns(columns);
      } catch (error) {
        console.error('Error fetching source columns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTargetColumns = async () => {
      setIsLoading(true);
      try {
        const columns = await getResourceAttributesByGroupId('7850');
        console.log('Fetched Target Columns:', columns);
        setTargetColumns(columns);
        setFilteredTargetColumns(columns);
      } catch (error) {
        console.error('Error fetching target columns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMappingColumns = async () => {
      setIsLoading(true);
      try {
        const columns = await getResourceAttributeAssociationsByGroupId('7850');
        console.log('Fetched Mapping Columns:', columns);
        setMappingColumns(columns);
        setFilteredMappingColumns(columns);
      } catch (error) {
        console.error('Error fetching mapping columns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSourceColumns();
    fetchTargetColumns();
    fetchMappingColumns();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const searchResults = term ? searchColumns(term, searchIndex) : sourceColumns;
    setFilteredSourceColumns(searchResults);
  };

  const handleAutoMap = () => {
    // mockMappingSuggestions.forEach(suggestion => {
    //   updateMapping(suggestion.sourceId, suggestion.targetId, suggestion.confidence);
    // });
    setActiveDialog('suggestions');
  };


  // const handleMappingChange = (row, newMapping) => {
  //   setMappings(prev => [...prev, newMapping]);
  // };
  
  // const handleMappingUpdate = (mapping) => {
  //   // Update the mappings in your state/backend
  //   setMappings(prev => prev.map(m => 
  //     m.sourceId === mapping.sourceId ? mapping : m
  //   ));
  // };

  const handleDetailsSave = (updatedMapping) => {
    updateMapping(updatedMapping);
    setIsEditingDetails(false);
    setActiveView('grid');
  };

  const handleDetailsCancel = () => {
    setIsEditingDetails(false);
    setActiveView('grid');
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{mt:3, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
        <ToolbarContainer 
          onSearch={handleSearch}
          onAutoMap={handleAutoMap}
          onValidate={() => setActiveDialog('validation')}
          selectedCount={mappings.size}
          disabled={isLoading}
        />
        
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)'}}>
              <CircularProgress />
            </Box>
          ) : activeView === 'grid' ? (
            <MappingGrid
              sourceSchema={filteredSourceColumns}
              targetSchema={filteredTargetColumns}
              mappings={filteredMappingColumns}
              onRowSelect={(row) => {
                setSelectedMapping(row);
                setActiveView('details');
              }}
            />
          ) : (
            <MappingDetails
              sourceColumn={selectedMapping}
              targetColumn={filteredTargetColumns.find(t => t.id === selectedMapping?.mapping?.targetId)}
              mapping={selectedMapping?.mapping}
              isEditing={isEditingDetails}
              onEdit={() => setIsEditingDetails(true)}
              onSave={handleDetailsSave}
              onCancel={handleDetailsCancel}
              onOk={() => setActiveView('grid')}
            />
          )}
        </Box>

        <DataPreviewDialog 
          open={activeDialog === 'preview'}
          onClose={() => setActiveDialog(null)}
          // columnData={mockSampleData}
        />
        
        <MappingSuggestionsDialog 
          open={activeDialog === 'suggestions'}
          onClose={() => setActiveDialog(null)}
          // suggestions={mockMappingSuggestions}
          onApply={updateMapping}
        />
        
        <ValidationResultsDialog 
          open={activeDialog === 'validation'}
          onClose={() => setActiveDialog(null)}
          // validationResults={mockValidationResults}
        />
        
        <DataProfileDialog 
          open={activeDialog === 'profile'}
          onClose={() => setActiveDialog(null)}
          // columnProfile={mockColumnProfile}
        />
      </Box>
    </Container>
  );
};

export default SchemaMapping;
