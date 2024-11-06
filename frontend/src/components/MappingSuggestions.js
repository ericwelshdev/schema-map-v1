// frontend/src/components/ResourceMappingTagging.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import MappingSuggestions from './MappingSuggestions';
import { getMappingSuggestions, submitMappingFeedback } from '../services/aiMappingService';

const ResourceMappingTagging = ({ savedState, onStateChange }) => {
    const [mappingSuggestions, setMappingSuggestions] = useState([]);
    const [acceptedMappings, setAcceptedMappings] = useState([]);
    
    useEffect(() => {
        const loadSuggestions = async () => {
            const sourceColumns = savedState.resourceConfig.processedSchema;
            const targetColumns = savedState.dataDictionaryConfig.processedSchema;
            
            const suggestions = await getMappingSuggestions(sourceColumns, targetColumns);
            setMappingSuggestions(suggestions);
        };
        
        loadSuggestions();
    }, [savedState]);

    const handleAcceptMapping = async (suggestion) => {
        const newMapping = {
            sourceColumn: suggestion.source_column,
            targetColumn: suggestion.suggested_mappings[0].target_column,
            confidence: suggestion.suggested_mappings[0].confidence
        };
        
        setAcceptedMappings([...acceptedMappings, newMapping]);
        
        await submitMappingFeedback({
            mapping: newMapping,
            feedback: 'accept',
            metadata: suggestion.suggested_mappings[0].metadata_match
        });
        
        onStateChange({
            ...savedState,
            mappings: [...acceptedMappings, newMapping]
        });
    };

    const handleRejectMapping = async (suggestion) => {
        await submitMappingFeedback({
            mapping: {
                sourceColumn: suggestion.source_column,
                targetColumn: suggestion.suggested_mappings[0].target_column
            },
            feedback: 'reject'
        });
        
        setMappingSuggestions(mappingSuggestions.filter(
            s => s.source_column !== suggestion.source_column
        ));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">AI-Suggested Mappings</Typography>
                <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12}>
                <MappingSuggestions 
                    suggestions={mappingSuggestions}
                    onAccept={handleAcceptMapping}
                    onReject={handleRejectMapping}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6">Accepted Mappings</Typography>
                <Divider sx={{ my: 2 }} />
                {acceptedMappings.map((mapping, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                        <Typography>
                            {mapping.sourceColumn} → {mapping.targetColumn}
                        </Typography>
                    </Box>
                ))}
            </Grid>
        </Grid>
    );
};

export default ResourceMappingTagging;
