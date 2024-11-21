import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getResources = async () => {
  const response = await axios.get(`${API_URL}/resources`);
  return response.data;
};

export const postResource = async (sourceData) => {
  try {
  const formattedData = {
    ds_id: 0, 
    dsstrc_attr_grp_id: null,
    stdiz_abrvd_attr_grp_nm: sourceData.stdiz_abrvd_attr_grp_nm,
    dsstrc_attr_grp_nm: sourceData.dsstrc_attr_grp_nm,
    dsstrc_attr_grp_shrt_nm: sourceData.dsstrc_attr_grp_shrt_nm,
    dsstrc_attr_grp_desc: sourceData.dsstrc_attr_grp_desc,
    dsstrc_attr_grp_src_typ_cd: sourceData.dsstrc_attr_grp_src_typ_cd,
    pii_ind: sourceData.pii_ind,
    phi_ind: sourceData.phi_ind,
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
//     console.log('postBulkSourceAttribute Sending column data:', formattedData); // to verify the array
    const response = await axios.post(`${API_URL}/resources`, formattedData);
    console.log('response.data', response.data);
    const { dsstrc_attr_grp_id } = response.data;

    return {
    ...response.data,
    id: dsstrc_attr_grp_id // Ensure we have a standard id field
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

export const putResource = async (id, sourceData) => {
  const response = await axios.put(`${API_URL}/resources/${id}`, sourceData);
  return response.data;
};

export const deleteResource = async (id) => {
  await axios.delete(`${API_URL}/resources/${id}`);
};

// Bulk create source attributes
export const postBulkResource = async (sourceData) => {
  // console.log('!!! postBulkResource received:', sourceData);
  try {
    const formattedData = sourceData.map(grp => ({
      ds_id: 0, 
      dsstrc_attr_grp_id: null,
      stdiz_abrvd_attr_grp_nm: grp.stdiz_abrvd_attr_grp_nm,
      dsstrc_attr_grp_nm: grp.dsstrc_attr_grp_nm,
      dsstrc_attr_grp_shrt_nm: grp.dsstrc_attr_grp_shrt_nm,
      dsstrc_attr_grp_desc: grp.dsstrc_attr_grp_desc,
      dsstrc_attr_grp_src_typ_cd: grp.dsstrc_attr_grp_src_typ_cd,
      pii_ind: grp.pii_ind,
      phi_ind: grp.phi_ind,
      ai_tag_cmplx: grp.ai_tag_cmplx,
      usr_tag_cmplx: grp.usr_tag_cmplx,
      meta_tag_cmplx: grp.meta_tag_cmplx,
      ai_cmt_txt: grp.ai_cmt_txt,
      usr_cmt_txt: grp.usr_cmt_txt,
      oprtnl_stat_cd: 'Active',
      cre_by_nm: 'System',
      cre_ts: new Date().toISOString(),
      updt_by_nm: 'System',
      updt_ts: new Date().toISOString()
    }));
    // console.log('!!! postBulkSourceAttribute Sending column data:', formattedData); // to verify the array
    const response = await axios.post(`${API_URL}/resources/bulk`, formattedData);
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

