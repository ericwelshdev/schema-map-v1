import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  Button, Chip, Stack, IconButton,
  FormControlLabel, Radio, RadioGroup, FormControl,
  LinearProgress, Step, StepLabel, Stepper,
  Alert
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TimelineIcon from '@mui/icons-material/Timeline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StorageIcon from '@mui/icons-material/Storage';
import SchemaIcon from '@mui/icons-material/Schema';
import SecurityIcon from '@mui/icons-material/Security';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { getData } from '../utils/storageUtils';
import { postSource } from '../services/resourceService';
import { postBulkSourceAttribute } from '../services/resourceAttributeService';
import { postDDSource } from '../services/ddSourceService';

const ResourceSummary = ({ wizardState }) => {
  const [profilingOption, setProfilingOption] = useState('now');
  const [generalConfigData, setGeneralConfig] = useState({});
  const [resourceGeneralConfig, setResourceGeneralConfig] = useState({});
  const [ddResourceGeneralConfig, setDDResourceGeneralConfig] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveProgress, setSaveProgress] = useState({
    activeStep: 0,
    completed: false,
    error: null
  });

  const saveSteps = [
    'Saving Resource Configuration',
    'Processing Schema Information',
    'Saving Data Dictionary',
    'Creating Column Mappings',
    'Setting up Profiling Tasks'
  ];

  useEffect(() => {
    const loadConfigs = async () => {
      try {

        const wizardStateEssential = await localStorage.getItem('wizardStateEssential');
        const generalConfigData = typeof wizardStateEssential === 'string' 
          ? JSON.parse(wizardStateEssential) 
          : wizardStateEssential;  

        const resourceGeneralConfig = await getData('resourcePreviewRows') || {};
        console.log('Resource General Config:', resourceGeneralConfig);

        const ddResourceGeneralConfig = await getData('ddResourcePreviewRows') || {};
        console.log('DD Resource General Config:', ddResourceGeneralConfig);        


        console.log('Parsed General Config:', generalConfigData);
        
        setGeneralConfig(generalConfigData);        
        setResourceGeneralConfig(resourceGeneralConfig);
        setDDResourceGeneralConfig(ddResourceGeneralConfig);
      } catch (error) {
        console.log('Config loading fallback activated');
        setGeneralConfig({});
        setResourceGeneralConfig({});
        setDDResourceGeneralConfig({});
      }
    };
    
    loadConfigs();
  }, []);

  const hasDDMapping = wizardState?.ddResourceSetup?.resourceType !== 'skip';

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      setSaveProgress(prev => ({ ...prev, activeStep: 0 }));
      console.log('General Config Data:', generalConfigData.resourceSetup);
      // Log the source data being sent
      const sourceData = {
        stdiz_abrvd_attr_grp_nm: generalConfigData?.resourceSetup?.standardizedSourceName,
        dsstrc_attr_grp_nm: generalConfigData?.resourceSetup?.resourceName,
        dsstrc_attr_grp_shrt_nm: generalConfigData?.resourceSetup?.standardizedSourceName,
        dsstrc_attr_grp_desc: generalConfigData?.resourceSetup?.resourceDescription,
        dsstrc_attr_grp_src_typ_cd: 'Source',
        pii_ind: wizardState?.resourceConfig?.processedSchema?.some(col => col?.isPII) || false,
        phi_ind: wizardState?.resourceConfig?.processedSchema?.some(col => col?.isPHI) || false,
        user_tag_cmplx: JSON.stringify(generalConfigData?.resourceSetup?.resourceTags || []),
        usr_cmt_txt: generalConfigData?.resourceSetup?.resourceDescription,
        oprtnl_stat_cd: 'Active'
      };

      console.log('Sending source data:', sourceData);
      const savedSource = await postSource(sourceData);

      const sourceId = savedSource?.dsstrc_attr_grp_id;
      console.log('Saved Source ID:', sourceId);
      
      // Continue with rest of the save process
      setSaveProgress(prev => ({ ...prev, activeStep: 1 }));
      // Add schema processing logic
      console.log('Resource General Config Data:', resourceGeneralConfig);
      // Log the source data being sent

      const columnData = resourceGeneralConfig?.map((column) => ({
        ds_id: 0,
        dsstrc_attr_grp_id: sourceId,
        stdiz_abrvd_attr_grp_nm: generalConfigData?.resourceSetup?.standardizedSourceName,
        dsstrc_attr_nm: column.name,
        dsstrc_alt_attr_nm: column.alternativeName,
        stdiz_abrvd_attr_nm: column.name,
        dsstrc_attr_desc: column.description || '',
        dsstrc_attr_seq_nbr: column.order,
        physcl_data_typ_nm: column.type || 'string',
        mand_ind: column?.isNullable || false,
        pk_ind: column?.isPrimaryKey || false,
        encrypt_ind: false,
        pii_ind: column.isPII || false,
        phi_ind: column.isPHI || false,
        disabld_ind: column.isDisabled,
        user_tag_cmplx: JSON.stringify(column?.tags || []),
        usr_cmt_txt: column.comment || '',
        oprtnl_stat_cd: 'Active'
      }));
      
      console.log('Sending column data:', resourceGeneralConfig);
      console.log('Sending source attribute data:', columnData);
      const savedSourceAttributeData = await postBulkSourceAttribute({ attributes: columnData }); 
      console.log('Recevied saved attribute data:', savedSourceAttributeData);


      // Step 3: Save Data Dictionary if needed
      setSaveProgress(prev => ({ ...prev, activeStep: 2 }));
      if (hasDDMapping) {
        // Add DD save logic

        setSaveProgress(prev => ({ ...prev, activeStep: 0 }));
        console.log('General Config Data:', generalConfigData.ddResourceSetup);
        // Log the source data being sent
        const ddSourceData = {
          stdiz_abrvd_attr_grp_nm: generalConfigData?.ddResourceSetup?.standardizedSourceName,
          dsstrc_attr_grp_nm: generalConfigData?.ddResourceSetup?.resourceName,
          dsstrc_attr_grp_shrt_nm: generalConfigData?.ddResourceSetup?.standardizedSourceName,
          dsstrc_attr_grp_desc: generalConfigData?.ddResourceSetup?.resourceDescription,
          dsstrc_attr_grp_src_typ_cd: 'Data Dictionary',
          pii_ind: wizardState?.resourceConfig?.processedSchema?.some(col => col?.isPII) || false,
          phi_ind: wizardState?.resourceConfig?.processedSchema?.some(col => col?.isPHI) || false,
          user_tag_cmplx: JSON.stringify(generalConfigData?.ddResourceSetup?.resourceTags || []),
          usr_cmt_txt: generalConfigData?.ddResourceSetup?.resourceDescription,
          oprtnl_stat_cd: 'Active'
        };
  
        console.log('Sending Data Dictionary source data:', ddSourceData);
        const savedDDSource = await postSource(ddSourceData);
  
        const ddSourceId = savedDDSource?.dsstrc_attr_grp_id;
        console.log('Saved Data Dictionary Source ID:', ddSourceId);



      // Continue with rest of the save process
      setSaveProgress(prev => ({ ...prev, activeStep: 1 }));
      // Add schema processing logic
      console.log('Data Dictionary Resource General Config Data:', ddResourceGeneralConfig);
      // Log the source data being sent

      const ddColumnData = ddResourceGeneralConfig?.map((column) => ({
        ds_id: 0,
        dsstrc_attr_grp_id: sourceId,
        stdiz_abrvd_attr_grp_nm: generalConfigData?.ddResourceSetup?.standardizedSourceName,
        dsstrc_attr_nm: column.name,
        dsstrc_alt_attr_nm: column.alternativeName,
        stdiz_abrvd_attr_nm: column.name,
        dsstrc_attr_desc: column.description || '',
        dsstrc_attr_seq_nbr: column.order,
        physcl_data_typ_nm: column.type || 'string',
        mand_ind: column?.isNullable || false,
        pk_ind: column?.isPrimaryKey || false,
        encrypt_ind: false,
        pii_ind: column.isPII || false,
        phi_ind: column.isPHI || false,
        disabld_ind: column.isDisabled,
        user_tag_cmplx: JSON.stringify(column?.tags || []),
        usr_cmt_txt: column.comment || '',
        oprtnl_stat_cd: 'Active'
      }));
      
      console.log('Sending column data:', ddResourceGeneralConfig);
      console.log('Sending Data Dictionary attribute data:', ddColumnData);
      const savedDDSourceAttributeData = await postBulkSourceAttribute({ attributes: ddColumnData }); 
      console.log('Recevied Data Dictionary saved attribute data:', savedDDSourceAttributeData);

      }

      // Step 4: Create Mappings if needed
      setSaveProgress(prev => ({ ...prev, activeStep: 3 }));
      if (hasDDMapping) {
        // Add mapping save logic
      }

      // Step 5: Setup Profiling
      setSaveProgress(prev => ({ ...prev, activeStep: 4 }));
      if (profilingOption === 'now') {
        // Add immediate profiling logic
      } else if (profilingOption === 'schedule') {
        // Add schedule profiling logic
      }

      setSaveProgress(prev => ({ ...prev, completed: true }));
    } catch (error) {
      console.error('Save error:', error);
      setSaveProgress(prev => ({ ...prev, error: error.message }));
    } finally {
      setIsProcessing(false);
    }
  };

  const renderProgressSection = () => (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Stepper activeStep={saveProgress.activeStep}>
        {saveSteps.map((label, index) => (
          <Step key={label} completed={saveProgress.activeStep > index}>
            <StepLabel
              StepIconProps={{
                icon: saveProgress.activeStep > index ? <CheckCircleIcon color="success" /> : index + 1
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {isProcessing && (
        <LinearProgress sx={{ mt: 2 }} />
      )}
      {saveProgress.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {saveProgress.error}
        </Alert>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Resource Details Card */}
        <Grid item xs={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StorageIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Resource Details</Typography>
              </Box>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body2">{resourceGeneralConfig?.resourceInfo?.name ?? 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Type</Typography>
                  <Chip size="small" label={resourceGeneralConfig?.resourceInfo?.type ?? 'N/A'} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Size</Typography>
                  <Typography variant="body2">{resourceGeneralConfig?.resourceInfo?.size ? `${resourceGeneralConfig.resourceInfo.size} bytes` : 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Collection</Typography>
                  <Typography variant="body2">{wizardState?.resourceSetup?.collection ?? 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Last Modified</Typography>
                  <Typography variant="body2">{resourceGeneralConfig?.resourceInfo?.lastModified ?? 'N/A'}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Schema Overview Card */}
        <Grid item xs={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchemaIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Schema Overview</Typography>
              </Box>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Columns</Typography>
                  <Chip size="small" label={wizardState?.resourceConfig?.processedSchema?.length ?? 0} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Active Columns</Typography>
                  <Chip 
                    size="small" 
                    label={wizardState?.resourceConfig?.processedSchema?.filter(col => !col?.isDisabled)?.length ?? 0}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">PII Columns</Typography>
                  <Chip 
                    size="small" 
                    icon={<SecurityIcon sx={{ fontSize: 16 }} />}
                    label={wizardState?.resourceConfig?.processedSchema?.filter(col => col?.isPII)?.length ?? 0}
                    color="warning"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">PHI Columns</Typography>
                  <Chip 
                    size="small"
                    icon={<SecurityIcon sx={{ fontSize: 16 }} />} 
                    label={wizardState?.resourceConfig?.processedSchema?.filter(col => col?.isPHI)?.length ?? 0}
                    color="error"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Disabled Columns</Typography>
                  <Chip 
                    size="small"
                    label={wizardState?.resourceConfig?.processedSchema?.filter(col => col?.isDisabled)?.length ?? 0}
                    color="default"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Dictionary Mapping Card */}
        <Grid item xs={4}>
          {hasDDMapping ? (
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LinkIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Data Dictionary Mapping</Typography>
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Mapped Table</Typography>
                    <Typography variant="body2">{wizardState?.mappingTagging?.selectedTable ?? 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Overall Score</Typography>
                    <Chip 
                      size="small"
                      label={`${wizardState?.mappingTagging?.confidenceScore?.toFixed(1) ?? 0}%`}
                      color={(wizardState?.mappingTagging?.confidenceScore ?? 0) >= 60 ? "success" : "warning"}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Name Match</Typography>
                    <Chip 
                      size="small"
                      label={`${wizardState?.mappingTagging?.tableNameSimilarity?.toFixed(1) ?? 0}%`}
                      color={(wizardState?.mappingTagging?.tableNameSimilarity ?? 0) >= 60 ? "success" : "warning"}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Column Match</Typography>
                    <Chip 
                      size="small"
                      label={`${wizardState?.mappingTagging?.columnMatchConfidence?.toFixed(1) ?? 0}%`}
                      color={(wizardState?.mappingTagging?.columnMatchConfidence ?? 0) >= 60 ? "success" : "warning"}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Match Quality</Typography>
                    <Chip 
                      size="small"
                      label={`${wizardState?.mappingTagging?.matchQuality?.toFixed(1) ?? 0}%`}
                      color={(wizardState?.mappingTagging?.matchQuality ?? 0) >= 60 ? "success" : "warning"}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <InfoOutlinedIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Data Dictionary Status</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  No Data Dictionary Mapping Required
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Progress Section */}
        {(isProcessing || saveProgress.error || saveProgress.completed) && (
          <Grid item xs={12}>
            {renderProgressSection()}
          </Grid>
        )}

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
            onClick={handleSave}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Finish & ${profilingOption === 'now' ? 'Start Profiling' : 'Save Settings'}`}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceSummary;

