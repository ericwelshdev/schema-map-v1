import React, { useState } from 'react';
import { Box, Container, Slide } from '@mui/material';
import ToolbarContainer from '../components/SchemaMapping/Toolbars/ToolbarContainer';
import MappingGrid from '../components/SchemaMapping/Grid/MappingGrid';
import MappingDetails from '../components/SchemaMapping/Details/MappingDetails';
import DataPreviewDialog from '../components/SchemaMapping/Dialogs/DataPreviewDialog';
import MappingSuggestionsDialog from '../components/SchemaMapping/Dialogs/MappingSuggestionsDialog';
import ValidationResultsDialog from '../components/SchemaMapping/Dialogs/ValidationResultsDialog';
import DataProfileDialog from '../components/SchemaMapping/Dialogs/DataProfileDialog';

import { useMappingState } from '../components/SchemaMapping/hooks/useMappingState';
import { createSearchIndex, searchColumns } from '../components/SchemaMapping/utils/searchUtils';

import {
  mockSourceSchema,
  mockTargetSchema,
  mockMappingSuggestions,
  mockValidationResults,
  mockSampleData,
  mockColumnProfile,
} from '../components/SchemaMapping/mockData/schemaMappingData';
  const SchemaMapping = () => {
    const { mappings, updateMapping } = useMappingState();
    const [selectedMapping, setSelectedMapping] = useState(null);
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [activeView, setActiveView] = useState('grid');
    const [activeDialog, setActiveDialog] = useState(null);
    const [searchIndex] = useState(() => createSearchIndex([...mockSourceSchema, ...mockTargetSchema]));

    const handleSearch = (term) => {
      const results = searchColumns(term, searchIndex);
      // Search functionality to be implemented
    };

    const handleAutoMap = () => {
      mockMappingSuggestions.forEach(suggestion => {
        updateMapping(suggestion.sourceId, suggestion.targetId, suggestion.confidence);
      });
      setActiveDialog('suggestions');
    };

    const handleDetailsSave = (updatedMapping) => {
      updateMapping(updatedMapping);
      setIsEditingDetails(false);
      setActiveView('grid');
    };

    const handleDetailsCancel = () => {
      setIsEditingDetails(false);
      setActiveView('grid');
    };

    const handleDetailsOk = () => {
      setActiveView('grid');
    };

    return (
      <Container maxWidth={false} disableGutters>
        <Box sx={{ 
          height: '100vh', 
          width: '100%', 
          position: 'relative', 
          overflow: 'hidden' ,
          mt:3
        }}>
          <ToolbarContainer 
            onSearch={handleSearch}
            onAutoMap={handleAutoMap}
            onValidate={() => setActiveDialog('validation')}
            selectedCount={mappings.size}
          />
        
          <Box sx={{ 
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
          }}>
            <Box 
              sx={{ 
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: `translateX(${activeView === 'grid' ? '0' : '-100%'})`,
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              <MappingGrid
                sourceSchema={mockSourceSchema}
                targetSchema={mockTargetSchema}
                mappings={mockMappingSuggestions}
                onRowSelect={(row) => {
                  setSelectedMapping(row);
                  setActiveView('details');
                }}
              />
            </Box>

            <Box 
              sx={{ 
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: `translateX(${activeView === 'details' ? '0' : '100%'})`,
                transition: 'transform 0.3s ease-in-out'
              }}
            >
            <MappingDetails
            sourceColumn={selectedMapping}
            targetColumn={mockTargetSchema.find(t => t.id === selectedMapping?.mapping?.targetId)}
            mapping={selectedMapping?.mapping || { type: 'unmapped' }}
            isEditing={isEditingDetails}
            onEdit={() => setIsEditingDetails(true)}
            onSave={handleDetailsSave}
            onCancel={handleDetailsCancel}
            onOk={handleDetailsOk}
          />
            </Box>
          </Box>

          <DataPreviewDialog 
            open={activeDialog === 'preview'}
            onClose={() => setActiveDialog(null)}
            columnData={mockSampleData}
          />
        
          <MappingSuggestionsDialog 
            open={activeDialog === 'suggestions'}
            onClose={() => setActiveDialog(null)}
            suggestions={mockMappingSuggestions}
            onApply={updateMapping}
          />
        
          <ValidationResultsDialog 
            open={activeDialog === 'validation'}
            onClose={() => setActiveDialog(null)}
            validationResults={mockValidationResults}
          />
        
          <DataProfileDialog 
            open={activeDialog === 'profile'}
            onClose={() => setActiveDialog(null)}
            columnProfile={mockColumnProfile}
          />
        </Box>
      </Container>
    );
  };
export default SchemaMapping;