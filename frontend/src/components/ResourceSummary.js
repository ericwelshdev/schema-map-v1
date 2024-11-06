import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, 
  Button, Chip, Stack, IconButton,
  FormControlLabel, Radio, RadioGroup, FormControl,
  LinearProgress, Step, StepLabel, Stepper  
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TimelineIcon from '@mui/icons-material/Timeline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StorageIcon from '@mui/icons-material/Storage';
import SchemaIcon from '@mui/icons-material/Schema';
import PIIIcon from '@mui/icons-material/Security';
import PHIIcon from '@mui/icons-material/HealthAndSafety';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { getData } from '../utils/storageUtils';
import { postResource } from '../services/resourceService';
import { postBulkResourceAttribute } from '../services/resourceAttributeService';
import { postResourceProfile } from '../services/resourceProfileService';
import { postResourceGroupAssociation } from '../services/resourceGroupAssociationService';
import { postBulkResourceAttributeAssociation } from '../services/resourceAttributeAssociationService';
import { mapDictionaryData } from '../services/dictionaryMappingService';

const ResourceSummary = ({ wizardState }) => {
  const [profilingOption, setProfilingOption] = useState('now');
  const [generalConfigData, setGeneralConfig] = useState({});
  const [resourceGeneralConfig, setResourceGeneralConfig] = useState({});
  const [resourceSchemaConfig, setResourceSchmeaConfig] = useState({});
  const [ddResourceGeneralConfig, setDDResourceGeneralConfig] = useState({});
  const [ddResourceSchemaConfig, setDDResourceSchemaConfig] = useState({});
  const [ddResourceSchemaMappingConfig, setDDResourceSchemaMappingConfig] = useState({});
  const [ddResourceFullDataConfig, setDDResourceFullDataConfig] = useState({});
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

        const wizardStateEssential = await localStorage.getItem('wizardStateEssential') || {};
        const generalConfigData = typeof wizardStateEssential === 'string' 
        ? JSON.parse(wizardStateEssential) 
        : wizardStateEssential;

        const rawResourceGeneralConfig = await localStorage.getItem('resourceGeneralConfig') || {};
        const resourceGeneralConfig = typeof rawResourceGeneralConfig === 'string' 
        ? JSON.parse(rawResourceGeneralConfig) 
        : rawResourceGeneralConfig;

        console.log('Resource General Config:', resourceGeneralConfig);

        const rawDDResourceGeneralConfig = await localStorage.getItem('ddResourceGeneralConfig') || {};
        const ddResourceGeneralConfig = typeof rawDDResourceGeneralConfig === 'string' 
        ? JSON.parse(rawDDResourceGeneralConfig) 
        : rawDDResourceGeneralConfig;
        
        console.log('DDResource General Config:', ddResourceGeneralConfig);

        const resourceSchmeaConfig = await getData('resourcePreviewRows') || {};
        console.log('Resource Schema Config:', resourceSchmeaConfig);

        const ddResourceSchemaConfig = await getData('ddResourcePreviewRows') || {};
        console.log('DD Resource Schema Config:', ddResourceGeneralConfig);  
        
        const ddResourceSchemaMappingConfig = await getData('ddResourceMappingRows') || {};
        console.log('DD Resource Schema Mapping Config:', ddResourceSchemaMappingConfig); 

        const ddResourceFullDataConfig = await getData('ddResourceMappingRows') || {};
        console.log('DD Resource Full Data Config:', ddResourceFullDataConfig);         
        

        console.log('Parsed General Config:', generalConfigData);
        
        setGeneralConfig(generalConfigData);        
        setResourceSchmeaConfig(resourceSchmeaConfig);
        setDDResourceSchemaConfig(ddResourceSchemaConfig);
        setResourceGeneralConfig(resourceGeneralConfig);
        setDDResourceGeneralConfig(ddResourceGeneralConfig); 
        setDDResourceSchemaMappingConfig(ddResourceSchemaMappingConfig)
        setDDResourceFullDataConfig(ddResourceFullDataConfig)   
      } catch (error) {
        console.log('Config loading fallback activated');
        setGeneralConfig({});
        setResourceSchmeaConfig({});
        setDDResourceSchemaConfig({});
        setResourceGeneralConfig({});
        setDDResourceGeneralConfig({});
        setDDResourceSchemaMappingConfig({});
        setDDResourceFullDataConfig({});

      }
    };
    
    loadConfigs();
  }, []);

  const hasDDMapping = wizardState?.ddResourceSetup?.resourceType !== 'skip';

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      setSaveProgress(prev => ({ ...prev, activeStep: 0 }));



      // 1. Save Resource Configuration
      // console.log('General Config Data:', generalConfigData.resourceSetup);
      // Log the source data being sent
      const resourceData = {
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

      // console.log('Sending source data:', resourceData);
      const savedResourceResponse = await postResource(resourceData);

      const savedResource = {
        dsstrc_attr_grp_id: savedResourceResponse.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedResourceResponse.stdiz_abrvd_attr_grp_nm,
        isSaved: true
      };      
      console.log('--> Step 1. Resource Prior Saved Info :', savedResource);

      //---------------------------------------------------------------

      // 2. Save Resource Schema
      // Continue with rest of the save process
      setSaveProgress(prev => ({ ...prev, activeStep: 1 }));
      // Add schema processing logic
      // console.log('Resource General Config Data:', resourceSchemaConfig);

      const columnData = resourceSchemaConfig?.map((column) => ({
        ds_id: 0,
        abrvd_attr_nm: column.name || null,
        dsstrc_attr_grp_id: savedResource.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedResource.stdiz_abrvd_attr_grp_nm,
        dsstrc_attr_nm: column.name,
        dsstrc_alt_attr_nm: column.alternativeName || null,
        stdiz_abrvd_attr_nm: column.name,
        stdiz_abrvd_alt_attr_nm: column?.alternativeName || null,
        dsstrc_attr_desc: column.description || null,
        dsstrc_attr_seq_nbr: column.order,
        physcl_data_typ_nm: column.type || 'string',
        mand_ind: column?.isNullable || false,
        pk_ind: column?.isPrimaryKey || false,
        fk_ind: column?.isForeignKey || false,
        encrypt_ind: false,
        pii_ind: column.isPII || false,
        phi_ind: column.isPHI || false,
        disabld_ind: column.isDisabled,
        ai_tag_cmplx: JSON.stringify(column?.ai_tag_cmplx || []),
        user_tag_cmplx: JSON.stringify(column?.tags || []),
        meta_tag_cmplx: JSON.stringify(column?.schemaClassification || []),
        usr_cmt_txt: column.comment || null,
        oprtnl_stat_cd: 'Active'
      }));
      
      // console.log('Sending column data:', resourceSchemaConfig);
      // console.log('Sending resource attribute data:', columnData);
      const savedResourceAttributeData = await postBulkResourceAttribute({ attributes: columnData }); 

      const savedResourceAttributes = savedResourceAttributeData.map(column => ({
        dsstrc_attr_grp_id: column.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: column.stdiz_abrvd_attr_grp_nm,
        dsstrc_attr_id: column.dsstrc_attr_id,
        stdiz_abrvd_attr_nm: column.stdiz_abrvd_attr_nm,
        isSaved: true
      }));
      console.log('--> Step 2. Resource Attributes Prior Saved Info :', savedResourceAttributes); 



      // //---------------------------------------------------------------
      // console.log('General resourceInfo Data:', resourceGeneralConfig.resourceInfo);

      // 2. Save Resource Profile Configuration
      const resourceProfileData = {
        dsstrc_attr_grp_id: savedResource.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedResource.stdiz_abrvd_attr_grp_nm,
        ds_instc_data_cntnt_typ_cd: resourceGeneralConfig?.resourceType,
        ds_instc_data_cntnt_nm: resourceGeneralConfig?.resourceInfo?.type,
        ds_instc_data_cntnt_min_dt: null,
        ds_instc_data_cntnt_max_dt: null,
        par_ds_instc_id: null,
        ds_instc_physcl_nm: resourceGeneralConfig?.resourceInfo?.name,
        ds_instc_loc_txt: resourceGeneralConfig?.resourceInfo?.sourceLocation,
        ds_instc_arrival_dt: resourceGeneralConfig?.resourceInfo?.lastModified,
        ds_instc_publd_dt: resourceGeneralConfig?.resourceInfo?.lastModified,
        ds_instc_row_cnt: resourceGeneralConfig?.fullNumRows,
        ds_instc_col_cnt: resourceGeneralConfig?.numCols,
        ds_instc_size_nbr: resourceGeneralConfig?.resourceInfo?.size,
        ds_instc_comprsn_ind: null,
        ds_instc_file_cnt: 1,
        ds_instc_ingstn_prop_cmplx: JSON.stringify(resourceGeneralConfig?.ingestionSettings),
        ds_instc_chksum_id: resourceGeneralConfig?.resourceInfo?.checksum,
        ds_instc_part_ind: false,
        ds_instc_late_arrival_ind: false,
        ds_instc_resupply_ind: false,
        pii_ind: wizardState?.resourceConfig?.processedSchema?.some(col => col?.isPII) || false,
        phi_ind: wizardState?.resourceConfig?.processedSchema?.some(col => col?.isPHI) || false,
        ai_tag_cmplx: null,
        user_tag_cmplx: JSON.stringify(generalConfigData?.resourceSetup?.resourceTags || []),
        usr_cmt_txt: generalConfigData?.resourceSetup?.resourceDescription,
        oprtnl_stat_cd: 'Active'
      };

      // console.log('Sending resource Profile data:', resourceProfileData);
      const savedResourceProfileData = await postResourceProfile(resourceProfileData);

      const savedResourceProfile = {
        ds_attr_grp_instc_prof_id: savedResourceProfileData.ds_attr_grp_instc_prof_id,
        ds_instc_physcl_nm: savedResourceProfileData.ds_instc_physcl_nm,
        isSaved: true
      };
      console.log('--> Step 3. Resource Profile Prior Saved Info :', savedResourceProfile);

      //---------------------------------------------------------------


      // Step 3: Save Data Dictionary if needed
      setSaveProgress(prev => ({ ...prev, activeStep: 2 }));
      if (hasDDMapping) {
        // Add DD save logic

        // console.log('General Config Data:', generalConfigData.ddResourceSetup);
        // Log the resource data being sent
        const ddResourceData = {
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
  
        console.log('Sending Data Dictionary resource data:', ddResourceData);
        const savedDDResourceResponse = await postResource(ddResourceData);

        const savedDDResource = {
          dsstrc_attr_grp_id: savedDDResourceResponse.dsstrc_attr_grp_id,
          stdiz_abrvd_attr_grp_nm: savedDDResourceResponse.stdiz_abrvd_attr_grp_nm,
          isSaved: true
        };  
        console.log('--> Step 4. Data Dictionary Prior Saved Info :', savedDDResource);

        // ---------------------------------------------------------------
      

      // Continue with rest of the save process

      // Add schema processing logic
      console.log('Data Dictionary Resource General Config Data:', ddResourceSchemaConfig);
      // Log the resource data being sent

      

      const ddColumnData = ddResourceSchemaConfig?.map((column) => ({
        ds_id: 0,
        abrvd_attr_nm: column.name || null,
        dsstrc_attr_grp_id: savedDDResource.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedDDResource.stdiz_abrvd_attr_grp_nm,
        dsstrc_attr_nm: column.name,
        dsstrc_alt_attr_nm: column.alternativeName || null,
        stdiz_abrvd_attr_nm: column.name,
        stdiz_abrvd_alt_attr_nm: column?.alternativeName || null,
        dsstrc_attr_desc: column.description || null,
        dsstrc_attr_seq_nbr: column.order,
        physcl_data_typ_nm: column.type || 'string',
        mand_ind: column?.isNullable || false,
        pk_ind: column?.isPrimaryKey || false,
        fk_ind: column?.isForeignKey || false,
        encrypt_ind: false,
        pii_ind: column.isPII || false,
        phi_ind: column.isPHI || false,
        disabld_ind: column.isDisabled,
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
    }));
    
      
      // console.log('Sending column data:', ddResourceSchemaConfig);
      console.log('Sending Data Dictionary attribute data:', ddColumnData);
      const savedDDSourceAttributeData = await postBulkResourceAttribute({ attributes: ddColumnData }); 
      console.log('Recevied Data Dictionary saved attribute data:', savedDDSourceAttributeData);

      
      const savedDDResourceAttributes = savedDDSourceAttributeData.map(column => ({
        dsstrc_attr_grp_id: column.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: column.stdiz_abrvd_attr_grp_nm,
        dsstrc_attr_id: column.dsstrc_attr_id,
        stdiz_abrvd_attr_nm: column.stdiz_abrvd_attr_nm,
        meta_tag_cmplx: column.meta_tag_cmplx,
        isSaved: true
      }));
      console.log('-- Step 5. Data Dictionary Resource Attributes Prior Saved Info :', savedDDResourceAttributes); 

      

      console.log('-- !! Step 6.ddResourceGeneralConfig :', ddResourceGeneralConfig); 

      

      // 2. Save Resource Profile Configuration
      const ddResourceProfileData = {
        dsstrc_attr_grp_id: savedDDResource.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedDDResource.stdiz_abrvd_attr_grp_nm,
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
      console.log('--> Step 6. Data Dictionary Resource Profile Prior Saved Info :', savedResourceProfile);

    //---------------------------------------------------------------

    // ---------------------------------------------------------------

    // Step 4 Create Associations betwen Resource and Data Dictionary
    // Continue with rest of the save process
    setSaveProgress(prev => ({ ...prev, activeStep: 1 }));
    // Add schema processing logic
    console.log('Resource and Data Dictionary Prior Saved Info :', savedResource, savedDDResource);
    // Log the resource data being sent

    const resourceGroupAsscData = {

      ds_id: 0, 
      dsstrc_attr_grp_id: savedResource.dsstrc_attr_grp_id,
      stdiz_abrvd_attr_grp_nm: savedResource.stdiz_abrvd_attr_grp_nm,
      assct_ds_id: 0,
      assct_dsstrc_attr_grp_id: savedDDResource.dsstrc_attr_grp_id,
      assct_stdiz_abrvd_attr_grp_nm: savedDDResource.stdiz_abrvd_attr_grp_nm,
      techncl_rule_nm: null,
      dsstrc_attr_grp_assc_typ_cd: 'Source -> Data Dictionary',
      ai_tag_cmplx: null,
      user_tag_cmplx: null,
      usr_cmt_txt: null,
      oprtnl_stat_cd: 'Active',
      cre_by_nm: 'System',
      cre_ts: new Date().toISOString(),
      updt_by_nm: 'System',
      updt_ts: new Date().toISOString()

    };
    console.log('Sending Resource Association data:', resourceGroupAsscData);
    const savedResourceGroupAsscData = await postResourceGroupAssociation(resourceGroupAsscData);

    const savedResourceGroupAssc = {
      dsstrc_attr_grp_assc_id: savedResourceGroupAsscData.dsstrc_attr_grp_assc_id,
      dsstrc_attr_grp_id: savedResourceGroupAsscData.dsstrc_attr_grp_id,
      stdiz_abrvd_attr_grp_nm: savedResourceGroupAsscData.stdiz_abrvd_attr_grp_nm,
      assct_dsstrc_attr_grp_id: savedResourceGroupAsscData.assct_dsstrc_attr_grp_id,
      assct_stdiz_abrvd_attr_grp_nm: savedResourceGroupAsscData.assct_stdiz_abrvd_attr_grp_nm,
      dsstrc_attr_grp_assc_typ_cd: savedResourceGroupAsscData.dsstrc_attr_grp_assc_typ_cd,      
      isSaved: true
    };  
    console.log('--> Step 7. Resource Association Prior Saved Info :', savedResourceGroupAssc);


    // 1. Save Data Dictionary Group Resource Configuration
      // console.log('General Config Data:', generalConfigData.resourceSetup);
      // Log the source data being sent
      const ddTableValueData = {
        ds_id: 0,
        dsstrc_attr_grp_id: savedDDResource.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: ddResourceSchemaMappingConfig[0].matched_table_name,
        dsstrc_attr_grp_nm: ddResourceSchemaMappingConfig[0].logicalTableName,
        dsstrc_attr_grp_desc: ddResourceSchemaMappingConfig[0].tableDescription || '',
        dsstrc_attr_grp_src_typ_cd: 'Data Dictionary MetaData',
        pii_ind: ddResourceSchemaMappingConfig.some(col => col.isPII),
        phi_ind: ddResourceSchemaMappingConfig.some(col => col.isPHI),
        ai_tag_cmplx: JSON.stringify(ddResourceSchemaMappingConfig[0]?.table_ai_tags || []),
        user_tag_cmplx: JSON.stringify(ddResourceSchemaMappingConfig[0]?.table_tags || []),
        usr_cmt_txt: ddResourceSchemaMappingConfig[0]?.tableComment || '',
        oprtnl_stat_cd: 'Active'
    };

      // console.log('Sending source data:', resourceData);
      const savedDDSourceMappedGroup = await postResource(ddTableValueData);

      const savedDDSourceMappedGroupResponse = {
        dsstrc_attr_grp_id: savedDDSourceMappedGroup.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedDDSourceMappedGroup.stdiz_abrvd_attr_grp_nm,
        isSaved: true
      };      
      console.log('-- Step 8. Data Dictionary Resource Mapped Group Prior Saved Info :', savedDDSourceMappedGroupResponse); 



      // Add schema processing logic
      console.log('Data Dictionary Resource Mapped Data:', ddResourceSchemaMappingConfig);
      // Log the resource data being sent

      const ddColumnValueData = ddResourceSchemaMappingConfig?.filter(column => column.mappingStatus === "mapped").map((column) => ({
        ds_id: 0,
        abrvd_attr_nm: column.matched_column_name || null,
        dsstrc_attr_grp_id: savedDDSourceMappedGroup.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedDDSourceMappedGroup.stdiz_abrvd_attr_grp_nm,
        dsstrc_attr_nm: column.logicalColumnName || column.columnName,
        dsstrc_alt_attr_nm: column.columnAlternativeName || null,
        stdiz_abrvd_attr_nm: column.matched_column_name,
        stdiz_abrvd_alt_attr_nm: column?.columnAlternativeName || null,
        dsstrc_attr_desc: column.columnDescription || null,
        dsstrc_attr_seq_nbr: column.id,
        physcl_data_typ_nm: column.dataType || 'string',
        mand_ind: column?.isNullable || false,
        pk_ind: column?.isPrimaryKey || false,
        fk_ind: column?.isForeignKey || false,
        encrypt_ind: column?.isEncrypted || false,
        pii_ind: column.isPII || false,
        phi_ind: column.isPHI || false,
        disabld_ind: column.isDisabled || false,
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
      }));
      
      // console.log('Sending Data Dictionary attribute data:', ddColumnValueData);
      const savedDDSourceMappedAttribute = await postBulkResourceAttribute({ attributes: ddColumnValueData }); 
      console.log('Recevied Data Dictionary Resource Mapped Attribute saved data:', savedDDSourceMappedAttribute);

      
      const savedDDSourceMappedAttributes = savedDDSourceMappedAttribute.map(column => ({
        dsstrc_attr_grp_id: column.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: column.stdiz_abrvd_attr_grp_nm,
        dsstrc_attr_id: column.dsstrc_attr_id,
        stdiz_abrvd_attr_nm: column.stdiz_abrvd_attr_nm,
        meta_tag_cmplx: column.meta_tag_cmplx,
        column_similarity_score: column.column_similarity_score,
        isSaved: true
      }));
      console.log('-- Step 9. Data Dictionary Resource Mapped Attributes Prior Saved Info :', savedDDSourceMappedAttributes); 

      
      // 10. Save Data Dictionary Group Resource Association
      // Log the resource data being sent
  
      const resourceMappedGroupAsscData = {
  
        ds_id: 0, 
        dsstrc_attr_grp_id: savedResource.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedResource.stdiz_abrvd_attr_grp_nm,
        assct_ds_id: 0,
        assct_dsstrc_attr_grp_id: savedDDSourceMappedGroup.dsstrc_attr_grp_id,
        assct_stdiz_abrvd_attr_grp_nm: savedDDSourceMappedGroup.stdiz_abrvd_attr_grp_nm,
        techncl_rule_nm: null,
        dsstrc_attr_grp_assc_typ_cd: 'Source -> Data Dictionary Data',
        ai_tag_cmplx: null,
        user_tag_cmplx: null,
        usr_cmt_txt: null,
        oprtnl_stat_cd: 'Active',
        cre_by_nm: 'System',
        cre_ts: new Date().toISOString(),
        updt_by_nm: 'System',
        updt_ts: new Date().toISOString()
  
      };
      console.log('Sending Resource Mapped Association data:', resourceMappedGroupAsscData);
      const savedResourceMappedGroupAsscData = await postResourceGroupAssociation(resourceMappedGroupAsscData);
  
      const savedResourceMappedGroupAssc = {
        dsstrc_attr_grp_assc_id: savedResourceMappedGroupAsscData.dsstrc_attr_grp_assc_id,
        dsstrc_attr_grp_id: savedResourceMappedGroupAsscData.dsstrc_attr_grp_id,
        stdiz_abrvd_attr_grp_nm: savedResourceMappedGroupAsscData.stdiz_abrvd_attr_grp_nm,
        assct_dsstrc_attr_grp_id: savedResourceMappedGroupAsscData.assct_dsstrc_attr_grp_id,
        assct_stdiz_abrvd_attr_grp_nm: savedResourceMappedGroupAsscData.assct_stdiz_abrvd_attr_grp_nm,
        dsstrc_attr_grp_assc_typ_cd: savedResourceMappedGroupAsscData.dsstrc_attr_grp_assc_typ_cd,      
        isSaved: true
      };  
      console.log('--> Step 10. Resource Mapped Association Prior Saved Info :', savedResourceMappedGroupAssc);      


  // // ---------------------------------------------------------------

  // need to deterimine if we need to store the meta data mappings between the source and the data dict data values based on the schema mapping and confidance scoring 
 // First, filter savedResourceAttributes for mapped columns


// Then create associations for matched attributes
const resourceGroupAsscAttributeData = savedDDSourceMappedAttributes?.map((mappingAttribute) => {
  // Find matching resource attribute based on standardized names
  const resourceAttribute = savedResourceAttributes.find(attr =>
      attr.stdiz_abrvd_attr_grp_nm === mappingAttribute.stdiz_abrvd_attr_grp_nm &&
      attr.stdiz_abrvd_attr_nm === mappingAttribute.stdiz_abrvd_attr_nm
  );

  return {
      dsstrc_attr_assc_id: null,
      dsstrc_attr_grp_assc_id: savedResourceGroupAssc.dsstrc_attr_grp_assc_id,
      ds_id: 0,
      dsstrc_attr_grp_id: resourceAttribute?.dsstrc_attr_grp_id || savedResourceGroupAssc.dsstrc_attr_grp_id,
      stdiz_abrvd_attr_grp_nm: resourceAttribute?.stdiz_abrvd_attr_grp_nm || savedResourceGroupAssc.stdiz_abrvd_attr_grp_nm,
      dsstrc_attr_id: resourceAttribute?.dsstrc_attr_id || 0,
      stdiz_abrvd_attr_nm: resourceAttribute?.stdiz_abrvd_attr_nm || null,
      assct_ds_id: 0,
      assct_dsstrc_attr_grp_id: mappingAttribute.dsstrc_attr_grp_id,
      assct_stdiz_abrvd_attr_grp_nm: mappingAttribute.stdiz_abrvd_attr_grp_nm,
      assct_dsstrc_attr_id: mappingAttribute.dsstrc_attr_id,
      assct_stdiz_abrvd_attr_nm: mappingAttribute.stdiz_abrvd_attr_nm,
      column_similarity_score: mappingAttribute.column_similarity_score || 0,
      dsstrc_attr_assc_typ_cd: resourceAttribute ? 'Metadata Attribute Similarity Association' : 'Unmapped Attribute',
      dsstrc_attr_assc_cnfdnc_pct: mappingAttribute.column_similarity_score || 0,
      ai_tag_cmplx: mappingAttribute.ai_tags ? JSON.stringify(mappingAttribute.tags) : '',
      user_tag_cmplx: mappingAttribute.user_tags ? JSON.stringify(mappingAttribute.tags) : '',
      usr_cmt_txt: mappingAttribute.comments || '',
      oprtnl_stat_cd: 'Active',
      cre_by_nm: 'System',
      cre_ts: new Date().toISOString(),
      updt_by_nm: 'System',
      updt_ts: new Date().toISOString()
  };
});



  console.log('Sending Resource -> Data Dictionary Mapping attribute data:', resourceGroupAsscAttributeData);
  const savedResourceGroupAsscAttributeData = await postBulkResourceAttributeAssociation({ attributes: resourceGroupAsscAttributeData }); 
  console.log('Recevied Resource -> Data Dictionary Mappingsaved attribute data:', savedResourceGroupAsscAttributeData);

  
  const savedResourceGroupAsscAttributes = savedResourceGroupAsscAttributeData.map(column => ({
      dsstrc_attr_assc_id: savedResourceGroupAsscAttributeData.dsstrc_attr_assc_id,
      dsstrc_attr_grp_assc_id: savedResourceGroupAsscAttributeData.dsstrc_attr_grp_assc_id,
      dsstrc_attr_grp_id: savedResourceGroupAsscData.dsstrc_attr_grp_id,
      stdiz_abrvd_attr_grp_nm: savedResourceGroupAsscData.stdiz_abrvd_attr_grp_nm,
      dsstrc_attr_id: savedResourceGroupAsscAttributeData.dsstrc_attr_id,
      stdiz_abrvd_attr_nm: savedResourceGroupAsscAttributeData.stdiz_abrvd_attr_nm,
      assct_dsstrc_attr_grp_id: savedResourceGroupAsscData.assct_dsstrc_attr_grp_id,
      assct_stdiz_abrvd_attr_grp_nm: savedResourceGroupAsscData.assct_stdiz_abrvd_attr_grp_nm,
      assct_dsstrc_attr_id: savedResourceGroupAsscAttributeData.assct_dsstrc_attr_id,
      assct_stdiz_abrvd_attr_nm: savedResourceGroupAsscAttributeData.assct_stdiz_abrvd_attr_nm,
      dsstrc_attr_assc_typ_cd: savedResourceGroupAsscData.dsstrc_attr_assc_typ_cd,      
      isSaved: true
  }));
  console.log('--> Step 11. Data Dictionary Resource Attributes Prior Saved Info :', savedResourceGroupAsscAttributes);

    
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
                    icon={<PIIIcon sx={{ fontSize: 16 }} />}
                    label={wizardState?.resourceConfig?.processedSchema?.filter(col => col?.isPII)?.length ?? 0}
                    color="warning"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">PHI Columns</Typography>
                  <Chip 
                    size="small"
                    icon={<PHIIcon sx={{ fontSize: 16 }} />} 
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

