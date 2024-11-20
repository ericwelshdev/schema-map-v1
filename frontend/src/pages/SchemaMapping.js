import React, { useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import SidebarPanel from '../components/SchemaMapping/Sidebar/SidebarPanel';
import ToolbarContainer from '../components/SchemaMapping/Toolbars/ToolbarContainer';
import MappingGrid from '../components/SchemaMapping/Grid/MappingGrid';
import DataPreviewDialog from '../components/SchemaMapping/Dialogs/DataPreviewDialog';
import MappingSuggestionsDialog from '../components/SchemaMapping/Dialogs/MappingSuggestionsDialog';
import ValidationResultsDialog from '../components/SchemaMapping/Dialogs/ValidationResultsDialog';
import DataProfileDialog from '../components/SchemaMapping/Dialogs/DataProfileDialog';

import { useMappingState } from '../components/SchemaMapping/hooks/useMappingState';
import { useValidation } from '../components/SchemaMapping/hooks/useValidation';
import { useTransformation } from '../components/SchemaMapping/hooks/useTransformation';

import { createSearchIndex, searchColumns } from '../components/SchemaMapping/utils/searchUtils';

import {
  mockSourceSchema,
  mockTargetSchema,
  mockMappingSuggestions,
  mockValidationResults,
  mockSampleData,
  mockColumnProfile,
  mockTransformationRules
} from '../components/SchemaMapping/mockData/schemaMappingData';

const SchemaMapping = () => {
  const { mappings, updateMapping } = useMappingState();
  const { validationResults, validateMapping } = useValidation();
  const { transformations, applyTransformation } = useTransformation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [activeDialog, setActiveDialog] = useState(null);
  const [searchIndex] = useState(() => 
    createSearchIndex([...mockSourceSchema, ...mockTargetSchema])
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    const results = term ? searchColumns(term, searchIndex) : [];
    // Handle search results
  };

  const handleAutoMap = () => {
    mockMappingSuggestions.forEach(suggestion => {
      updateMapping(suggestion.sourceId, suggestion.targetId, suggestion.confidence);
    });
    setActiveDialog('suggestions');
  };
    return (
      <Container maxWidth={false} disableGutters sx={{ mt:3, height: '100vh', width: '100vw' , pr:15}}>
        <Box sx={{ 
          display: 'flex', 
          height: '100%',
          width: '100%',
          position: 'relative',
          paddingRight: '60px'
        }}>
          {/* Main Content */}
          <Box sx={{ 
            flex: 1,
            width: '100%',
            zIndex: 2  // Higher than collapsed sidebar
          }}>
            <ToolbarContainer 
              onSearch={handleSearch}
              onAutoMap={handleAutoMap}
              onValidate={() => setActiveDialog('validation')}
              selectedCount={mappings.size}
            />
            <Box sx={{ flex: 1, width: '100%' }}>
              <MappingGrid
                sourceSchema={mockSourceSchema}
                targetSchema={mockTargetSchema}
                mappings={mockMappingSuggestions}
              />
            </Box>
          </Box>
        </Box>
      {/* Floating Sidebar Panel */}
      <SidebarPanel />

      {/* Keep existing dialogs */}
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
    </Container>
  );
};

export default SchemaMapping;