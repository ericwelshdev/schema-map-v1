import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  Button, Chip, Stack, IconButton,
  FormControlLabel, Radio, RadioGroup, FormControl
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TimelineIcon from '@mui/icons-material/Timeline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StorageIcon from '@mui/icons-material/Storage';
import SchemaIcon from '@mui/icons-material/Schema';
import SecurityIcon from '@mui/icons-material/Security';
import LinkIcon from '@mui/icons-material/Link';
import DisabledIcon from '@mui/icons-material/RemoveModerator';
import PIIIcon from '@mui/icons-material/Security';
import PHIIcon from '@mui/icons-material/HealthAndSafety';
import { postSource } from '../services/sourceService';

const ResourceSummary = ({ wizardState }) => {
  const [profilingOption, setProfilingOption] = useState('now');
  const [generalConfig, setGeneralConfig] = useState(() => {
    const savedConfig = localStorage.getItem('wizardStateEssential');
    return savedConfig ? JSON.parse(savedConfig) : null;
  });



    const [resourceGeneralConfig, setResourceGeneralConfig] = useState(() => {
        const savedConfig = localStorage.getItem('resourceGeneralConfig');
        return savedConfig ? JSON.parse(savedConfig) : null;
      });

    const [ddResourceGeneralConfig, setDDResourceGeneralConfig] = useState(() => {
      const savedConfig = localStorage.getItem('ddResourceGeneralConfig');
      return savedConfig ? JSON.parse(savedConfig) : null;
    });






  const handleSaveSource = async () => {
    const resourceConfig = localStorage.getItem('resourceGeneralConfig');
    const parsedConfig = JSON.parse(resourceConfig);
  
    const sourceData = {
      name: parsedConfig.resourceInfo.name,
      description: wizardState.resourceSetup.resourceDescription,
      shortName: parsedConfig.resourceInfo.name.substring(0, 50),
      hasPII: wizardState.resourceConfig.processedSchema?.some(col => col.isPII),
      hasPHI: wizardState.resourceConfig.processedSchema?.some(col => col.isPHI),
      userTags: wizardState.resourceSetup.resourceTags,
      comments: wizardState.resourceSetup.resourceDescription
    };
  
    const savedSource = await postSource(sourceData);
    return savedSource;
  };

 

  return (
  
    <Box sx={{ p: 2 }}>
      
      <Grid container spacing={2}>
      {/* Resource Stats Row */}
      <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StorageIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Resource Details</Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">{generalConfig?.resourceSetup?.resourceSetup?.resourceName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                  {`  (${generalConfig?.resourceSetup?.resourceSetup?.standardizedSourceName})`}
                </Typography>
                </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Type</Typography>
                    <Chip size="small" label={resourceGeneralConfig?.resourceInfo?.type} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Size</Typography>
                    <Typography variant="body2">{resourceGeneralConfig?.resourceInfo?.size} bytes</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchemaIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Schema Overview</Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Total Columns</Typography>
                    <Chip size="small" label={resourceGeneralConfig?.processedSchema?.length || 0} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">PII Columns</Typography>
                    <Chip 
                      size="small" 
                      icon={<PIIIcon sx={{ fontSize: 16 }} />}
                      label={resourceGeneralConfig?.processedSchema?.filter(col => col.isPII).length || 0}
                      color="warning"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">PHI Columns</Typography>
                    <Chip 
                      size="small"
                      icon={<PHIIcon sx={{ fontSize: 16 }} />} 
                      label={resourceGeneralConfig?.processedSchema?.filter(col => col.isPHI).length || 0}
                      color="error"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Disabled Columns</Typography>
                    <Chip 
                      size="small"
                      icon={<DisabledIcon sx={{ fontSize: 16 }} />} 
                      label={resourceGeneralConfig?.processedSchema?.filter(col => col.isDisabled).length || 0}
                      color="info"
                    />
                  </Box>                  
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LinkIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Data Dictionary</Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Mapped Table</Typography>
                    <Typography variant="body2">{wizardState.mappingTagging?.selectedTable}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Match Quality</Typography>
                    <Chip 
                      size="small"
                      label={`${wizardState.mappingTagging?.matchConfidence || 0}%`}
                      color={wizardState.mappingTagging?.matchConfidence >= 60 ? "success" : "warning"}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Mapped Columns</Typography>
                    <Typography variant="body2">
                      {wizardState.mappingTagging?.mappedColumns}/{wizardState.mappingTagging?.totalColumns}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Data Dictionary Stats Row */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StorageIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Data Dictionary Details</Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">{generalConfig?.dataDictionarySetup?.ddResourceSetup?.resourceName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                  {`  (${generalConfig?.dataDictionarySetup?.ddResourceSetup?.standardizedSourceName})`}</Typography>
                     </Box>                              
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Type</Typography>
                    <Chip size="small" label={ddResourceGeneralConfig?.resourceInfo?.type} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Size</Typography>
                    <Typography variant="body2">{ddResourceGeneralConfig?.resourceInfo?.size} bytes</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchemaIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Schema Overview</Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Total Columns</Typography>
                    <Chip size="small" label={ddResourceGeneralConfig.processedSchema?.length || 0} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">PII Columns</Typography>
                    <Chip 
                      size="small" 
                      icon={<PIIIcon sx={{ fontSize: 16 }} />}
                      label={ddResourceGeneralConfig.processedSchema?.filter(col => col.isPII).length || 0}
                      color="warning"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">PHI Columns</Typography>
                    <Chip 
                      size="small"
                      icon={<PHIIcon sx={{ fontSize: 16 }} />} 
                      label={ddResourceGeneralConfig.processedSchema?.filter(col => col.isPHI).length || 0}
                      color="error"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Disabled Columns</Typography>
                    <Chip 
                      size="small"
                      icon={<isDisabledIcon sx={{ fontSize: 16 }} />} 
                      label={ddResourceGeneralConfig.processedSchema?.filter(col => col.isDisabled).length || 0}
                      color="info"
                    />
                  </Box>                  
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LinkIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Data Dictionary</Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Mapped Table</Typography>
                    <Typography variant="body2">{wizardState.mappingTagging?.selectedTable}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Match Quality</Typography>
                    <Chip 
                      size="small"
                      label={`${wizardState.mappingTagging?.matchConfidence || 0}%`}
                      color={wizardState.mappingTagging?.matchConfidence >= 60 ? "success" : "warning"}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Mapped Columns</Typography>
                    <Typography variant="body2">
                      {wizardState.mappingTagging?.mappedColumns}/{wizardState.mappingTagging?.totalColumns}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>



        {/* Profiling Options */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Data Profiling Options</Typography>
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={profilingOption}
                  onChange={(e) => setProfilingOption(e.target.value)}
                >
                  <FormControlLabel 
                    value="now" 
                    control={<Radio size="small" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PlayArrowIcon sx={{ mr: 0.5, fontSize: 18 }} />
                        <Typography variant="body2">Run Now (5-10 minutes)</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="background" 
                    control={<Radio size="small" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimelineIcon sx={{ mr: 0.5, fontSize: 18 }} />
                        <Typography variant="body2">Run in Background</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel 
                    value="schedule" 
                    control={<Radio size="small" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                        <Typography variant="body2">Schedule for Later</Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Button */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<PlayArrowIcon />}
          >
            Finish & {profilingOption === 'now' ? 'Start Profiling' : 'Save Settings'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceSummary;
