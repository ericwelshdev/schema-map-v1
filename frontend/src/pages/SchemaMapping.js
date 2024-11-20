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
    <Container maxWidth={false} sx={{ height: '100vh', p: 0, m: 0 , mt:3 }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Main Content Area - Full Width */}
        <Grid >
        <Box sx={{ flex: 1, p: 1 }}>
            <ToolbarContainer 
              onSearch={handleSearch}
              onAutoMap={handleAutoMap}
              onValidate={() => setActiveDialog('validation')}
              selectedCount={mappings.size}
            />
            
            {/* Grid View */}
            <Box sx={{ flex: 1, p: 1 }}>
              <MappingGrid
                sourceSchema={mockSourceSchema}
                targetSchema={mockTargetSchema}
                mappings={mockMappingSuggestions}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

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