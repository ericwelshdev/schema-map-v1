// frontend/src/components/ResourceDataDictionarySummary.js
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  Button, Chip, Stack, IconButton,
  LinearProgress, CircularProgress, Step, StepLabel, Stepper,Divider, Tooltip
  } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import SchemaIcon from '@mui/icons-material/Schema';
import CategoryIcon from '@mui/icons-material/Category';
import SaveIcon from '@mui/icons-material/Save';
import { initDB, getData } from '../utils/storageUtils';
import { postResource } from '../services/resourceService';
import { postBulkResourceAttribute } from '../services/resourceAttributeService';
import { postResourceProfile } from '../services/resourceProfileService';
import PIIIcon from '@mui/icons-material/Security';
import PHIIcon from '@mui/icons-material/HealthAndSafety';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AlertComponent from './AlertComponent';
import {  CheckCircle, Warning } from '@mui/icons-material';
import {
    TabletMac,
    Storage,
    TableChart,
    Api,
    Code,
    Description,
    Schema,
    Security,
    Key,
    VpnKey,
    HealthAndSafety
  } from '@mui/icons-material';

const ResourceDataDictionarySummary = ({ wizardState }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ddResourceSchemaConfig, setDDResourceSchemaConfig] = useState([]);
  const [ddResourceSchemaData, setDDResourceSchemaData] = useState([]);
  const [generalConfigData, setGeneralConfigData] = useState({});
  const [ddResourceGeneralConfig, setDDResourceGeneralConfig] = useState({});
  const [saveProgress, setSaveProgress] = useState({
      activeStep: 0,
      completed: false,
      error: null
  });

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    severity: 'info'
  });
  
  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };
  

  const saveSteps = [
      'Saving Data Dictionary Configuration',
      'Processing Schema Information',
      'Creating Column Definitions',
      'Setting up Metadata'
  ];

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await initDB();
                
                // Load data from localStorage
                const wizardStateEssential = await localStorage.getItem('wizardStateEssential');
                const generalConfigData = typeof wizardStateEssential === 'string'
                    ? JSON.parse(wizardStateEssential)
                    : wizardStateEssential;

                const rawDDResourceGeneralConfig = await localStorage.getItem('ddResourceGeneralConfig') || {};
                const ddResourceGeneralConfig = typeof rawDDResourceGeneralConfig === 'string'
                    ? JSON.parse(rawDDResourceGeneralConfig)
                    : rawDDResourceGeneralConfig;

                // Poll for IndexedDB data until it's available
                const checkData = async () => {
                    const schemaConfig = await getData('ddResourcePreviewRows');
                    const schemaData = await getData('ddResourceProcessedData');
                    if (schemaConfig && Object.keys(schemaConfig).length > 0 && schemaData && Object.keys(schemaData).length > 0) {
                        setDDResourceSchemaConfig(schemaConfig);
                        setDDResourceSchemaData(schemaData);
                        setGeneralConfigData(generalConfigData);
                        setDDResourceGeneralConfig(ddResourceGeneralConfig);
                        setIsLoading(false);
                    } else {
                        setTimeout(checkData, 500);
                    }
                };
                
                await checkData();
            } catch (error) {
                console.error('Error loading data:', error);
                setIsLoading(false);
            }
        };

        loadData();   
    }, []);

  
    if (isLoading) {
        return <Box sx={{ width: '100%' }}><LinearProgress /></Box>;
    }

    console.log('Resource wizardState:', wizardState);
    console.log('Resource ddResourceGeneralConfig:', ddResourceGeneralConfig);
    console.log('Resource generalConfigData:', generalConfigData);
    console.log('Resource ddResourceSchemaConfig:', ddResourceSchemaConfig);
    console.log('Resource ddResourceSchemaData:', ddResourceSchemaData); 


    // console.log('Table column counts:', ddResourceSchemaData.map(table => ({
    //     tableName: table.tableName,
    //     columnCount: table.columns?.length
    //   })));
      
    //   const totalColumns = ddResourceSchemaData.reduce((acc, table) => {
    //     const columnCount = Array.isArray(table.columns) ? table.columns.length : 0;
    //     console.log(`Table ${table.tableName}: ${columnCount} columns`);
    //     return acc + columnCount;
    //   }, 0);

              // Add this check at the start of calculations
      const schemaConfig = Array.isArray(ddResourceGeneralConfig) ? ddResourceGeneralConfig : [];

      // Dictionary Details Card metrics
      const dictionarySchemaMetrics = {
          resourceName: wizardState?.ddResourceSetup?.resourceName,
          resourceDescription: wizardState?.ddResourceSetup?.resourceDescription,
          resourceType: wizardState?.ddResourceSetup?.resourceType,
          standardizedSourceName: wizardState?.ddResourceSetup?.standardizedSourceName,
          versionText: wizardState?.ddResourceSetup?.versionText,
          resourceTags: wizardState?.ddResourceSetup?.resourceTags,
          name: ddResourceGeneralConfig?.resourceInfo?.name,
          type: ddResourceGeneralConfig?.resourceInfo?.type,
          ingestionProps: ddResourceGeneralConfig?.ingestionSettings,
          resourceChecksum: ddResourceGeneralConfig?.resourceInfo?.checksum,
          resourceSourceLocation: ddResourceGeneralConfig?.resourceInfo?.sourceLocation,
          distinctTables: 1,
          totalColumns: new Set(ddResourceSchemaConfig.map(col => col.id)).size,
          phiColumns: ddResourceSchemaConfig.reduce((acc, table) => acc + table.isPHI, 0) || 0,
          piiColumns: ddResourceSchemaConfig.reduce((acc, table) => acc + table.isPHI, 0) || 0,
          disabledColumns: ddResourceSchemaConfig.reduce((acc, table) => acc + table.isDisabled, 0) || 0,          
          size: ddResourceGeneralConfig?.resourceInfo?.size,
          runRows: ddResourceGeneralConfig?.resourceInfo?.fullNumRows,
          createdDate: ddResourceGeneralConfig?.resourceInfo?.createdDate,
          lastModified: ddResourceGeneralConfig?.resourceInfo?.lastModified,
          invalidTables: 0,
          invalidColumns: 0,
          classifiedColumns: ddResourceSchemaConfig.filter(col => col.schemaClassification?.value).length,
        

      };
      console.log('Resource dictionarySchema Metrics:', dictionarySchemaMetrics); 

      // Dictionary Details Card metrics
      const dictionaryDataMetrics = {
        resourceName: wizardState?.ddResourceSetup?.resourceName,
        resourceDescription: wizardState?.ddResourceSetup?.resourceDescription,
        resourceType: wizardState?.ddResourceSetup?.resourceType,
        standardizedSourceName: wizardState?.ddResourceSetup?.standardizedSourceName,
        versionText: wizardState?.ddResourceSetup?.versionText,
        resourceTags: wizardState?.ddResourceSetup?.resourceTags,
        name: ddResourceGeneralConfig?.resourceInfo?.name,
        type: ddResourceGeneralConfig?.resourceInfo?.type,
        distinctTables: new Set(ddResourceSchemaData.map(col => col.tableName)).size,
        totalColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.totalColumns, 0) || 0,
        nullableColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.nullableColumns, 0) || 0,
        phiColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.phiColumns, 0) || 0,
        piiColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.piiColumns, 0) || 0,
        pkColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.primaryKeys?.pk, 0) || 0,
        fkColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.foreignKeys?.fk, 0) || 0,
        disabledColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.foreignKeys?.fk, 0) || 0,   
        size: ddResourceGeneralConfig?.resourceInfo?.size,
        runRows: ddResourceGeneralConfig?.resourceInfo?.fullNumRows,
        lastModified: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        invalidTables: ddResourceSchemaData.filter(table => table.isInvalid).length,
        invalidColumns: ddResourceSchemaData.reduce((acc, table) => acc + table.columns.filter(col => col.isInvalid).length, 0)
    };
    console.log('Resource dictionaryData Metrics:', dictionaryDataMetrics);       

      // Classification Overview metrics
      const classificationMetrics = {

      };

      console.log("dictionaryDataMetrics",dictionaryDataMetrics)
      console.log("classificationMetrics",classificationMetrics)


    const handleSave = async () => {
        try {
            setIsProcessing(true);
            setSaveProgress(prev => ({ ...prev, activeStep: 0 }));

            // 1.  Save General Config
            const ddResourceSchema = {
              stdiz_abrvd_attr_grp_nm: generalConfigData?.ddResourceSetup?.standardizedSourceName,
              dsstrc_attr_grp_nm: generalConfigData?.ddResourceSetup?.resourceName,
              dsstrc_attr_grp_shrt_nm: generalConfigData?.ddResourceSetup?.standardizedSourceName,
              dsstrc_attr_grp_desc: generalConfigData?.ddResourceSetup?.resourceDescription,
              dsstrc_attr_grp_src_typ_cd: 'Data Dictionary Schema',
              phi_ind: dictionaryDataMetrics.phiColumns > 0 ? true : false,
              pii_ind: dictionaryDataMetrics.piiColumns > 0 ? true : false,
              user_tag_cmplx: JSON.stringify(generalConfigData?.ddResourceSetup?.resourceTags || []),
              usr_cmt_txt: generalConfigData?.ddResourceSetup?.resourceDescription,
              oprtnl_stat_cd: 'Active'
            };
      
            console.log('Sending Data Dictionary Schema resource data:', ddResourceSchema);
            const savedDDResourceSchemaResponse = await postResource(ddResourceSchema);
    
            const savedDDResourceSchema = {
              dsstrc_attr_grp_id: savedDDResourceSchemaResponse.dsstrc_attr_grp_id,
              stdiz_abrvd_attr_grp_nm: savedDDResourceSchemaResponse.stdiz_abrvd_attr_grp_nm,
              isSaved: true
            };  
            console.log('--> Step 1. Data Dictionary Schema Prior Saved Info :', savedDDResourceSchema);
    
            // ---------------------------------------------------------------
          

          // 2. Save Schema Config
          console.log('Data Dictionary Schema Config:', ddResourceSchemaConfig);
          // Log the resource data being sent
          
          const ddColumnData = ddResourceSchemaConfig?.map((column) => ({
            ds_id: 0,
            abrvd_attr_nm: column.name || null,
            dsstrc_attr_grp_id: savedDDResourceSchema.dsstrc_attr_grp_id,
            stdiz_abrvd_attr_grp_nm: savedDDResourceSchema.stdiz_abrvd_attr_grp_nm,
            dsstrc_attr_nm: column.name,
            dsstrc_alt_attr_nm: column?.alternativeName || null,
            stdiz_abrvd_attr_nm: column.name,
            stdiz_abrvd_alt_attr_nm: column?.alternativeName || null,
            dsstrc_attr_desc: column?.description || null,
            dsstrc_attr_seq_nbr: column.id,
            physcl_data_typ_nm: column.type || 'string',
            mand_ind: column?.isNullable || false,
            pk_ind: column?.isPrimaryKey || false,
            fk_ind: column?.isForeignKey || false,
            encrypt_ind: false,
            pii_ind: column?.isPII || false,
            phi_ind: column?.isPHI || false,
            disabld_ind: column?.isDisabled || false,
            ai_tag_cmplx: JSON.stringify(column?.ai_tag_cmplx || []),
            user_tag_cmplx: JSON.stringify(column?.tags || []),
            meta_tag_cmplx: JSON.stringify({
              ...(column?.schemaClassification?.value && {
                  schemaClassification: {
                      label: column.schemaClassification.label,
                      value: column.schemaClassification.value
                  }
              }),
              ...(column.column_similarity_score && {
                  column_similarity_score: column.column_similarity_score
              })
          }) || JSON.stringify([]),
            usr_cmt_txt: column.comment || null,
            oprtnl_stat_cd: 'Active'
        })
    );
        
          console.log('Sending Data Dictionary Schema attribute data:', ddColumnData);
          const savedDDSourceAttributeSchemaResponse = await postBulkResourceAttribute({ attributes: ddColumnData }); 
          console.log('Recevied Data Dictionary Schema saved attribute data:', savedDDSourceAttributeSchemaResponse);
    
          
          const savedDDResourceSchemaAttributes = savedDDSourceAttributeSchemaResponse.map(column => ({
            dsstrc_attr_grp_id: column.dsstrc_attr_grp_id,
            stdiz_abrvd_attr_grp_nm: column.stdiz_abrvd_attr_grp_nm,
            dsstrc_attr_id: column.dsstrc_attr_id,
            stdiz_abrvd_attr_nm: column.stdiz_abrvd_attr_nm,
            meta_tag_cmplx: column.meta_tag_cmplx,
            isSaved: true
          }));
          console.log('-- Step 2. Data Dictionary Resource Attributes Prior Saved Info :', savedDDResourceSchemaAttributes); 


          

      // 3. Save Resource Profile Configuration
      const ddResourceProfileData = {
        dsstrc_attr_grp_id: savedDDResourceSchema.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedDDResourceSchema.stdiz_abrvd_attr_grp_nm,
        ds_instc_data_cntnt_typ_cd: ddResourceGeneralConfig?.resourceType,
        ds_instc_data_cntnt_nm: ddResourceGeneralConfig?.resourceInfo?.type,
        ds_instc_data_cntnt_min_dt: null,
        ds_instc_data_cntnt_max_dt: null,
        par_ds_instc_id: null,
        ds_instc_physcl_nm: ddResourceGeneralConfig?.resourceInfo?.name,
        ds_instc_loc_txt: ddResourceGeneralConfig?.resourceInfo?.sourceLocation,
        ds_instc_arrival_dt: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        ds_instc_publd_dt: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        ds_instc_row_cnt: ddResourceGeneralConfig?.resourceInfo?.fullNumRows,
        ds_instc_col_cnt: ddResourceGeneralConfig?.resourceInfo?.numCols,
        ds_instc_size_nbr: ddResourceGeneralConfig?.resourceInfo?.size,
        ds_instc_comprsn_ind: null,
        ds_instc_file_cnt: 1,
        ds_instc_ingstn_prop_cmplx: JSON.stringify(ddResourceGeneralConfig?.ingestionSettings),
        ds_instc_chksum_id: ddResourceGeneralConfig?.resourceInfo?.checksum,
        ds_instc_part_ind: false,
        ds_instc_late_arrival_ind: false,
        ds_instc_resupply_ind: false,
        pii_ind: wizardState?.ddResourceConfig?.processedSchema?.some(col => col?.isPII) || false,
        phi_ind: wizardState?.ddResourceConfig?.processedSchema?.some(col => col?.isPHI) || false,
        ai_tag_cmplx: null,
        user_tag_cmplx: JSON.stringify(ddResourceGeneralConfig?.resourceSetup?.resourceTags || []),
        usr_cmt_txt: ddResourceGeneralConfig?.resourceSetup?.resourceDescription,
        oprtnl_stat_cd: 'Active'
      };

      console.log('Sending Data Dictionary Resource Profile data:', ddResourceProfileData);
      const savedDDResourceProfileData = await postResourceProfile(ddResourceProfileData);

      const savedResourceProfile = {
        id: savedDDResourceProfileData.ds_attr_grp_instc_prof_id,
        name: savedDDResourceProfileData.ds_instc_physcl_nm,
        isSaved: true
      };
      console.log('--> Step 3. Data Dictionary Resource Profile Prior Saved Info :', savedResourceProfile);
    
        //   // ---------------------------------------------------------------
            

    // 4.  Save Resource Schema Data ( the data from the data dictionary )
    const ddResourceData = ddResourceSchemaData.flatMap(table => ({
        stdiz_abrvd_attr_grp_nm: table.tableName,
        dsstrc_attr_grp_nm: table.logicalName,
        dsstrc_attr_grp_shrt_nm: table.tableName,
        dsstrc_attr_grp_desc: table.tableDescription,
        dsstrc_attr_grp_src_typ_cd: 'Data Dictionary Data',
        phi_ind: table.phiColumns > 0 ? true : false,
        pii_ind: table.piiColumns > 0 ? true : false,
        user_tag_cmplx: JSON.stringify(generalConfigData?.ddResourceSetup?.resourceTags || []),
        usr_cmt_txt: null,
        oprtnl_stat_cd: 'Active'
    }));

    console.log('Sending Data Dictionary Data resource data:', ddResourceData);
    const savedDDResourceResponse = await postResource(ddResourceData);

    const savedDDResources = savedDDResourceResponse.map(table => ({
        dsstrc_attr_grp_id: table.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: table.stdiz_abrvd_attr_grp_nm,
        isSaved: true
      }));
      console.log('-- Step 4. Data Dictionary Resource Attributes Prior Saved Info :', savedDDResources); 


    // ---------------------------------------------------------------        


    //       // 2. Save Schema Config
    //       console.log('Data Dictionary Schema Data:', ddResourceSchemaData);
    //       // Log the resource data being sent
          
    //       const ddColumnData = ddResourceSchemaData.flatMap(table => 
    //         table.columns.map(column => ({
    //         ds_id: 0,
    //         abrvd_attr_nm: column.physicalName || null,
    //         dsstrc_attr_grp_id: savedDDResource.dsstrc_attr_grp_id,
    //         stdiz_abrvd_attr_grp_nm: column.physicalName,
    //         dsstrc_attr_nm: column.logicalName || column.physicalName,
    //         dsstrc_alt_attr_nm: column.alternativeName || null,
    //         stdiz_abrvd_attr_nm: column.physicalName,
    //         stdiz_abrvd_alt_attr_nm: column?.alternativeName || null,
    //         dsstrc_attr_desc: column.description || null,
    //         dsstrc_attr_seq_nbr: column.columnOrder || column.id,
    //         physcl_data_typ_nm: column.dataType || 'string',
    //         mand_ind: column?.isNullable || false,
    //         pk_ind: column?.isPrimaryKey || false,
    //         fk_ind: column?.isForeignKey || false,
    //         encrypt_ind: false,
    //         pii_ind: column.isPII || false,
    //         phi_ind: column.isPHI || false,
    //         disabld_ind: column.isDisabled,
    //         ai_tag_cmplx: JSON.stringify(column?.ai_tag_cmplx || []),
    //         user_tag_cmplx: JSON.stringify(column?.tags || []),
    //         meta_tag_cmplx: JSON.stringify({
    //           ...(column?.schemaClassification?.value && {
    //               schemaClassification: {
    //                   label: column.schemaClassification.label,
    //                   value: column.schemaClassification.value
    //               }
    //           }),
    //           ...(column.column_similarity_score && {
    //               column_similarity_score: column.column_similarity_score
    //           })
    //       }) || JSON.stringify([]),
    //         usr_cmt_txt: column.comment || null,
    //         oprtnl_stat_cd: 'Active'
    //     }))
    // );
        
    //       console.log('Sending Data Dictionary attribute data:', ddColumnData);
    //       const savedDDSourceAttributeData = await postBulkResourceAttribute({ attributes: ddColumnData }); 
    //       console.log('Recevied Data Dictionary saved attribute data:', savedDDSourceAttributeData);
    
          
    //       const savedDDResourceAttributes = savedDDSourceAttributeData.map(column => ({
    //         dsstrc_attr_grp_id: column.dsstrc_attr_grp_id,
    //         stdiz_abrvd_attr_grp_nm: column.stdiz_abrvd_attr_grp_nm,
    //         dsstrc_attr_id: column.dsstrc_attr_id,
    //         stdiz_abrvd_attr_nm: column.stdiz_abrvd_attr_nm,
    //         meta_tag_cmplx: column.meta_tag_cmplx,
    //         isSaved: true
    //       }));
    //       console.log('-- Step 2. Data Dictionary Resource Attributes Prior Saved Info :', savedDDResourceAttributes); 
    
    //     //   // ---------------------------------------------------------------
          
    
        //   // 3. Save Resource Profile Configuration
        //   const ddResourceProfileData = {
        //     dsstrc_attr_grp_id: savedDDResource.dsstrc_attr_grp_id,
        //     stdiz_abrvd_attr_grp_nm: savedDDResource.stdiz_abrvd_attr_grp_nm,
        //     ds_instc_data_cntnt_typ_cd: ddResourceGeneralConfig?.resourceType,
        //     ds_instc_data_cntnt_nm: ddResourceGeneralConfig?.resourceInfo?.type,
        //     ds_instc_data_cntnt_min_dt: null,
        //     ds_instc_data_cntnt_max_dt: null,
        //     par_ds_instc_id: null,
        //     ds_instc_physcl_nm: ddResourceGeneralConfig?.resourceInfo?.name,
        //     ds_instc_loc_txt: ddResourceGeneralConfig?.resourceInfo?.sourceLocation,
        //     ds_instc_arrival_dt: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        //     ds_instc_publd_dt: ddResourceGeneralConfig?.resourceInfo?.lastModified,
        //     ds_instc_row_cnt: ddResourceGeneralConfig?.resourceInfo?.fullNumRows,
        //     ds_instc_col_cnt: ddResourceGeneralConfig?.resourceInfo?.numCols,
        //     ds_instc_size_nbr: ddResourceGeneralConfig?.resourceInfo?.size,
        //     ds_instc_comprsn_ind: null,
        //     ds_instc_file_cnt: 1,
        //     ds_instc_ingstn_prop_cmplx: JSON.stringify(ddResourceGeneralConfig?.ingestionSettings),
        //     ds_instc_chksum_id: ddResourceGeneralConfig?.resourceInfo?.checksum,
        //     ds_instc_part_ind: false,
        //     ds_instc_late_arrival_ind: false,
        //     ds_instc_resupply_ind: false,
        //     pii_ind: wizardState?.ddResourceConfig?.processedSchema?.some(col => col?.isPII) || false,
        //     phi_ind: wizardState?.ddResourceConfig?.processedSchema?.some(col => col?.isPHI) || false,
        //     ai_tag_cmplx: null,
        //     user_tag_cmplx: JSON.stringify(ddResourceGeneralConfig?.resourceSetup?.resourceTags || []),
        //     usr_cmt_txt: ddResourceGeneralConfig?.resourceSetup?.resourceDescription,
        //     oprtnl_stat_cd: 'Active'
        //   };
    
        //   console.log('Sending Data Dictionary Resource Profile data:', ddResourceProfileData);
        //   const savedDDResourceProfileData = await postResourceProfile(ddResourceProfileData);
    
        //   const savedResourceProfile = {
        //     id: savedDDResourceProfileData.ds_attr_grp_instc_prof_id,
        //     name: savedDDResourceProfileData.ds_instc_physcl_nm,
        //     isSaved: true
        //   };
        //   console.log('--> Step 3. Data Dictionary Resource Profile Prior Saved Info :', savedResourceProfile);





            setSaveProgress(prev => ({ ...prev, completed: true }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred while saving';
            setAlert({
                show: true,
                severity: 'error',
                message: `Save failed: ${errorMessage}`
              });
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
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {isProcessing && <LinearProgress sx={{ mt: 2 }} />}
        </Box>
    );

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };
    


    const getResourceTypeIcon = (type) => {
        const typeMap = {
          'excel': <TabletMac color="success" />,
          'csv': <TableChart color="primary" />,
          'database': <Storage color="secondary" />,
          'api': <Api color="info" />,
          'json': <Code color="warning" />,
          'xml': <Code color="error" />
        };
        return typeMap[type.toLowerCase()] || <Description />;
      };


      const MetricCard = ({ title, icon, children }) => (
        <Card elevation={2} sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {icon}
            <Typography variant="subtitle1" sx={{ ml: 1 }}>{title}</Typography>
          </Box>
          {children}
        </Card>
      );

      const MetricCount = ({ total, invalid, label, color = "primary" }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress
            variant="determinate"
            value={((total - invalid) / total) * 100}
            size={24}
            color={invalid > 0 ? "warning" : "success"}
          />
          <Box>
            <Typography variant="body2">{label}</Typography>
            <Typography variant="h6" component="span">
              {total - invalid}
              <Typography 
                component="span" 
                variant="caption" 
                color={invalid > 0 ? 'error.main' : 'text.secondary'}
                sx={{ ml: 0.5 }}
              >
                /{invalid}
              </Typography>
            </Typography>
          </Box>
        </Box>
      );
      
      
      return (
        <Grid container spacing={1} sx={{ maxHeight: '50vh' }}>
          {/* Resource Details Card */}
          <Grid item xs={12}>
            <MetricCard title="Resource Details" icon={getResourceTypeIcon(dictionarySchemaMetrics.resourceType)}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="caption">Resource Name</Typography>
                      <Typography variant="body1" fontWeight="medium">{dictionarySchemaMetrics.resourceName}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption">Resource</Typography>
                      <Typography variant="body2">{dictionarySchemaMetrics.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption">Description</Typography>
                      <Typography variant="body2">{dictionarySchemaMetrics.resourceDescription}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption">Tags</Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {dictionarySchemaMetrics.resourceTags?.map(tag => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="caption">Standardized Name</Typography>
                      <Typography variant="body2">{dictionarySchemaMetrics.standardizedSourceName}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption">Type</Typography>
                      <Typography variant="body2">{dictionarySchemaMetrics.type}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="caption">Version</Typography>
                      <Typography variant="body2">{dictionarySchemaMetrics.versionText}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="caption">Size</Typography>
                      <Typography variant="body2">{formatFileSize(dictionarySchemaMetrics.size)}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="caption">Modified</Typography>
                      <Typography variant="body2">{formatDate(dictionarySchemaMetrics.lastModified)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MetricCard>
          </Grid>
      
          {/* Dictionary Schema Card */}
          <Grid item xs={6}>
            <MetricCard title="Dictionary Schema" icon={<Schema color="primary" />}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <MetricCount 
                    total={dictionarySchemaMetrics.distinctTables} 
                    invalid={dictionarySchemaMetrics.invalidTables}
                    label="Tables"
                  />
                </Grid>
                <Grid item xs={6}>
                  <MetricCount 
                    total={dictionarySchemaMetrics.totalColumns} 
                    invalid={dictionarySchemaMetrics.invalidColumns}
                    label="Columns"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      label={`Classified: ${dictionarySchemaMetrics.classifiedColumns}`}
                      size="small"
                      color={dictionarySchemaMetrics.classifiedColumns > 80 ? "success" : "warning"}
                    />
                    <Chip 
                      label={`Disabled: ${dictionarySchemaMetrics.disabledColumns}`}
                      size="small"
                      color={dictionarySchemaMetrics.disabledColumns > 0 ? "error" : "default"}
                    />
                    <Chip 
                      label={`PHI: ${dictionarySchemaMetrics.phiColumns}`}
                      size="small"
                      color={dictionarySchemaMetrics.phiColumns > 0 ? "error" : "default"}
                    />
                    <Chip 
                      label={`PII: ${dictionarySchemaMetrics.piiColumns}`}
                      size="small"
                      color={dictionarySchemaMetrics.piiColumns > 0 ? "warning" : "default"}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </MetricCard>
          </Grid>
      
          {/* Dictionary Data Card */}
          <Grid item xs={6}>
            <MetricCard title="Dictionary Data" icon={<Storage color="primary" />}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <MetricCount 
                    total={dictionaryDataMetrics.distinctTables} 
                    invalid={dictionaryDataMetrics.invalidTables}
                    label="Tables"
                  />
                </Grid>
                <Grid item xs={6}>
                  <MetricCount 
                    total={dictionaryDataMetrics.totalColumns} 
                    invalid={dictionaryDataMetrics.invalidColumns}
                    label="Columns"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      icon={<Key />}
                      label={`PK: ${dictionaryDataMetrics.pkColumns}`}
                      size="small"
                      color="info"
                    />
                    <Chip 
                      icon={<Key />}
                      label={`FK: ${dictionaryDataMetrics.fkColumns}`}
                      size="small"
                      color="info"
                    />
                    <Chip 
                      icon={<Security />}
                      label={`PHI: ${dictionaryDataMetrics.phiColumns}`}
                      size="small"
                      color={dictionaryDataMetrics.phiColumns > 0 ? "error" : "default"}
                    />
                    <Chip 
                      icon={<Security />}
                      label={`PII: ${dictionaryDataMetrics.piiColumns}`}
                      size="small"
                      color={dictionaryDataMetrics.piiColumns > 0 ? "warning" : "default"}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </MetricCard>
          </Grid>
        </Grid>
      );
      
      
};

export default ResourceDataDictionarySummary;
