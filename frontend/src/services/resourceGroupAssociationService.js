import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getResourceGroupAssociations = async () => {
  const response = await axios.get(`${API_URL}/resource-associations`);
  return response.data;
};

export const postResourceGroupAssociation = async (sourceData) => {
  console.log('postResourceGroupAssociation Input group data:', sourceData);

  const formattedData = {
    ds_id: 0,
    dsstrc_grp_assc_id: null,
    dsstrc_attr_grp_id: sourceData.dsstrc_attr_grp_id,
    stdiz_abrvd_attr_grp_nm: sourceData.stdiz_abrvd_attr_grp_nm,
    assct_ds_id: sourceData.assct_ds_id,
    assct_dsstrc_attr_grp_id: sourceData.assct_dsstrc_attr_grp_id,
    assct_stdiz_abrvd_attr_grp_nm: sourceData.assct_stdiz_abrvd_attr_grp_nm,
    techncl_rule_nm: sourceData.techncl_rule_nm,
    dsstrc_attr_grp_assc_typ_cd: sourceData.dsstrc_attr_grp_assc_typ_cd,
    ai_tag_cmplx: sourceData.ai_tag_cmplx,
    usr_tag_cmplx: sourceData.usr_tag_cmplx,
    meta_tag_cmplx: sourceData.meta_tag_cmplx,
    ai_cmt_txt: sourceData.ai_cmt_txt,
    usr_cmt_txt: sourceData.usr_cmt_txt,
    oprtnl_stat_cd: 'Active',
    cre_by_nm: 'System',
    cre_ts: new Date().toISOString(),
    updt_by_nm: 'System',
    updt_ts: new Date().toISOString()
  };

  console.log('postBulkResourceGroupAttributeAssociation Sending group data:', formattedData);
try {
    const response = await axios.post(`${API_URL}/resource-associations`, formattedData);
    console.log('response.data', response.data);
    const { dsstrc_grp_assc_id } = response.data;

    return {
    ...response.data,
    id: dsstrc_grp_assc_id // we have a standard id field
  };
    
} catch (error) {
  console.log('Received error response:', error.response?.data);
  const errorDetails = error.response?.data?.error;
  const enhancedError = new Error();
  enhancedError.name = errorDetails?.name;
  enhancedError.message = errorDetails?.message;
  enhancedError.details = errorDetails?.errors;
  enhancedError.sql = errorDetails?.sql;
  enhancedError.code = errorDetails?.code;
  throw enhancedError;
}
};

export const putResourceGroupAssociation = async (id, sourceData) => {
  const response = await axios.put(`${API_URL}/resource-associations/${id}`, sourceData);
  return response.data;
};

export const deleteResourceGroupAssociation = async (id) => {
  await axios.delete(`${API_URL}/resource-associations/${id}`);
};

// Bulk create source groups
export const postBulkResourceGroupAttributeAssociation = async (sourceGroups) => {
  // console.log('postBulkResourceGroupAttributeAssociation Input group data:', sourceGroups);
  try {
    const formattedData = sourceGroups.map(row => ({
      ds_id: 0, 
      dsstrc_grp_assc_id: null,
      dsstrc_attr_grp_id: row.dsstrc_attr_grp_id,
      stdiz_abrvd_attr_grp_nm: row.stdiz_abrvd_attr_grp_nm,
      assct_ds_id: row.assct_ds_id,
      assct_dsstrc_attr_grp_id: row.assct_dsstrc_attr_grp_id,
      assct_stdiz_abrvd_attr_grp_nm: row.assct_stdiz_abrvd_attr_grp_nm,
      techncl_rule_nm: row.techncl_rule_nm,
      dsstrc_attr_grp_assc_typ_cd: row.dsstrc_attr_grp_assc_typ_cd,
      ai_tag_cmplx: row.ai_tag_cmplx,
      usr_tag_cmplx: row.usr_tag_cmplx,
      meta_tag_cmplx: row.meta_tag_cmplx,
      ai_cmt_txt: row.ai_cmt_txt,
      usr_cmt_txt: row.usr_cmt_txt,
      oprtnl_stat_cd: 'Active',
      cre_by_nm: 'System',
      cre_ts: new Date().toISOString(),
      updt_by_nm: 'System',
      updt_ts: new Date().toISOString()
    }));
    
    if(formattedData.length === 0) {
      return {
        message: 'No data to save'
      };
    }
    // console.log('postBulkResourceGroupAttributeAssociation Sending group data:', formattedData); // to verify the array
    const response = await axios.post(`${API_URL}/resource-associations/bulk`, formattedData);
    console.log('response.data', response.data);
    return response.data;    

  } catch (error) {
    console.log('Received error response:', error.response?.data);
    const errorDetails = error.response?.data?.error;
    const enhancedError = new Error();
    enhancedError.name = errorDetails?.name;
    enhancedError.message = errorDetails?.message;
    enhancedError.details = errorDetails?.errors;
    enhancedError.sql = errorDetails?.sql;
    enhancedError.code = errorDetails?.code;
    throw enhancedError;
  }
};
