import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getSourceAttributeAssociations = async () => {
  const response = await axios.get(`${API_URL}/resource-attribute-associations`);
  return response.data;
};

export const postSourceAttributeAssociation = async (sourceData) => {
  const formattedData = {
    dsstrc_attr_assc_id: null,
    dsstrc_attr_grp_assc_id: sourceData.dsstrc_attr_grp_assc_id,
    ds_id: 0, 
    dsstrc_attr_grp_id: sourceData.dsstrc_attr_grp_id,
    stdiz_abrvd_attr_grp_nm: sourceData.stdiz_abrvd_attr_grp_nm,
    dsstrc_attr_id: sourceData.dsstrc_attr_id,
    stdiz_abrvd_attr_nm: sourceData.stdiz_abrvd_attr_nm,
    assct_ds_id: sourceData.assct_ds_id,
    assct_dsstrc_attr_grp_id: sourceData.assct_dsstrc_attr_grp_id,
    assct_stdiz_abrvd_attr_grp_nm: sourceData.assct_stdiz_abrvd_attr_grp_nm,
    assct_dsstrc_attr_id: sourceData.assct_dsstrc_attr_id,
    assct_stdiz_abrvd_attr_nm: sourceData.assct_stdiz_abrvd_attr_nm,
    techncl_rule_nm: sourceData.techncl_rule_nm,
    dsstrc_attr_assc_typ_cd: sourceData.dsstrc_attr_assc_typ_cd,
    ai_tag_cmplx: sourceData.ai_tag_cmplx,
    user_tag_cmplx: sourceData.user_tag_cmplx,
    usr_cmt_txt: sourceData.usr_cmt_txt,
    oprtnl_stat_cd: 'Active',
    cre_by_nm: 'System',
    cre_ts: new Date().toISOString(),
    updt_by_nm: 'System',
    updt_ts: new Date().toISOString()
  };


try {
    const response = await axios.post(`${API_URL}/resource-attribute-associations`, formattedData);
    console.log('response.data', response.data);
    const { dsstrc_attr_grp_assc_id } = response.data;

    return {
    ...response.data,
    id: dsstrc_attr_grp_assc_id // Ensure we have a standard id field
  };
    
  } catch (error) {
    // Extract the detailed error message from the AxiosError
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

export const putSourceAttributeAssociation = async (id, sourceData) => {
  const response = await axios.put(`${API_URL}/resource-attribute-associations/${id}`, sourceData);
  return response.data;
};

export const deleteSourceAttributeAssociation = async (id) => {
  await axios.delete(`${API_URL}/resource-attribute-associations/${id}`);
};

// Bulk create source attributes
export const postBulkSourceAttributeAssociation = async (sourceAttributes) => {
  // console.log('postBulkSourceAttributeAssociation Input column data:', sourceAttributes);
  try {
    const sourceData = sourceAttributes.attributes.map(attr => ({
    dsstrc_attr_assc_id: null,
    dsstrc_attr_grp_assc_id: sourceData.dsstrc_attr_grp_assc_id,
    ds_id: 0, 
    dsstrc_attr_grp_id: sourceData.dsstrc_attr_grp_id,
    stdiz_abrvd_attr_grp_nm: sourceData.stdiz_abrvd_attr_grp_nm,
    dsstrc_attr_id: sourceData.dsstrc_attr_id,
    stdiz_abrvd_attr_nm: sourceData.stdiz_abrvd_attr_nm,
    assct_ds_id: sourceData.assct_ds_id,
    assct_dsstrc_attr_grp_id: sourceData.assct_dsstrc_attr_grp_id,
    assct_stdiz_abrvd_attr_grp_nm: sourceData.assct_stdiz_abrvd_attr_grp_nm,
    assct_dsstrc_attr_id: sourceData.assct_dsstrc_attr_id,
    assct_stdiz_abrvd_attr_nm: sourceData.assct_stdiz_abrvd_attr_nm,
    techncl_rule_nm: sourceData.techncl_rule_nm,
    dsstrc_attr_assc_typ_cd: sourceData.dsstrc_attr_assc_typ_cd,
    dsstrc_attr_assc_cnfdnc_pct: sourceData.dsstrc_attr_assc_cnfdnc_pct,
    ai_tag_cmplx: sourceData.ai_tag_cmplx,
    user_tag_cmplx: sourceData.user_tag_cmplx,
    usr_cmt_txt: sourceData.usr_cmt_txt,
    oprtnl_stat_cd: 'Active',
    cre_by_nm: 'System',
    cre_ts: new Date().toISOString(),
    updt_by_nm: 'System',
    updt_ts: new Date().toISOString()
    }));
//     console.log('postBulkSourceAttributeAssociation Sending column data:', formattedData); // to verify the array
    const response = await axios.post(`${API_URL}/resource-attribute-associations/bulk`, sourceData);
    console.log('response.data', response.data);
    return response.data;    
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
