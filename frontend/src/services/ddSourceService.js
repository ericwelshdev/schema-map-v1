import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getSources = async () => {
  const response = await axios.get(`${API_URL}/ddsources`);
  return response.data;
};

export const postSource = async (sourceData) => {
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
    user_tag_cmplx: sourceData.user_tag_cmplx,
    usr_cmt_txt: sourceData.usr_cmt_txt,
    oprtnl_stat_cd: 'Active',
    cre_by_nm: 'System',
    cre_ts: new Date().toISOString(),
    updt_by_nm: 'System',
    updt_ts: new Date().toISOString()
  };


try {
    const response = await axios.post(`${API_URL}/ddsources`, formattedData);
    console.log('response.data', response.data);
    const { dsstrc_attr_grp_id } = response.data;

    return {
    ...response.data,
    id: dsstrc_attr_grp_id // Ensure we have a standard id field
  };
    
  } catch (error) {
    // Extract the detailed error message from the AxiosError
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

export const putSource = async (id, sourceData) => {
  const response = await axios.put(`${API_URL}/ddsources/${id}`, sourceData);
  return response.data;
};

export const deleteSource = async (id) => {
  await axios.delete(`${API_URL}/ddsources/${id}`);
};
