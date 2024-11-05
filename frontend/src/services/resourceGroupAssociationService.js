import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getResourceGroupAssociations = async () => {
  const response = await axios.get(`${API_URL}/resource-associations`);
  return response.data;
};

export const postResourceGroupAssociation = async (sourceData) => {
  const formattedData = {
    ds_id: 0, 
    dsstrc_attr_grp_assc_id: null,
    dsstrc_attr_grp_id: sourceData.dsstrc_attr_grp_id,
    stdiz_abrvd_attr_grp_nm: sourceData.stdiz_abrvd_attr_grp_nm,
    assct_ds_id: sourceData.assct_ds_id,
    assct_dsstrc_attr_grp_id: sourceData.assct_dsstrc_attr_grp_id,
    assct_stdiz_abrvd_attr_grp_nm: sourceData.assct_stdiz_abrvd_attr_grp_nm,
    techncl_rule_nm: sourceData.techncl_rule_nm,
    dsstrc_attr_grp_assc_typ_cd: sourceData.dsstrc_attr_grp_assc_typ_cd,
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
    const response = await axios.post(`${API_URL}/resource-associations`, formattedData);
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

export const putResourceGroupAssociation = async (id, sourceData) => {
  const response = await axios.put(`${API_URL}/resource-associations/${id}`, sourceData);
  return response.data;
};

export const deleteResourceGroupAssociation = async (id) => {
  await axios.delete(`${API_URL}/resource-associations/${id}`);
};

