import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getResourceProfiles = async () => {
  const response = await axios.get(`${API_URL}/resource-profiles`);
  return response.data;
};

export const postResourceProfile = async (data) => {
  const formattedData = {
    ds_id: 0, 
    dsstrc_attr_grp_id: data.dsstrc_attr_grp_id,
    stdiz_abrvd_attr_grp_nm: data.stdiz_abrvd_attr_grp_nm,
    ds_instc_data_cntnt_typ_cd: data.ds_instc_data_cntnt_typ_cd,
    ds_instc_data_cntnt_nm: data.ds_instc_data_cntnt_nm,
    ds_instc_data_cntnt_min_dt: data.ds_instc_data_cntnt_min_dt,
    ds_instc_data_cntnt_max_dt: data.ds_instc_data_cntnt_max_dt,
    par_ds_instc_id: data.par_ds_instc_id,
    ds_instc_physcl_nm: data.ds_instc_physcl_nm,
    ds_instc_loc_txt: data.ds_instc_loc_txt,
    ds_instc_arrival_dt: data.ds_instc_arrival_dt,
    ds_instc_publd_dt: data.ds_instc_publd_dt,
    ds_instc_row_cnt: data.ds_instc_row_cnt,
    ds_instc_col_cnt: data.ds_instc_col_cnt,
    ds_instc_size_nbr: data.ds_instc_size_nbr,
    ds_instc_comprsn_ind: data.ds_instc_comprsn_ind,
    ds_instc_file_cnt: data.ds_instc_file_cnt,
    ds_instc_chksum_id: data.ds_instc_chksum_id,
    ds_instc_part_ind: data.ds_instc_part_ind,
    ds_instc_late_arrival_ind: data.ds_instc_late_arrival_ind,
    ds_instc_resupply_ind: data.ds_instc_resupply_ind,
    pii_ind: data.pii_ind,
    phi_ind: data.phi_ind,
    ai_tag_cmplx: data.ai_tag_cmplx,
    usr_tag_cmplx: data.usr_tag_cmplx,
    meta_tag_cmplx: data.meta_tag_cmplx,
    ai_cmt_txt: data.ai_cmt_txt,
    usr_cmt_txt: data.usr_cmt_txt,
    oprtnl_stat_cd: 'Active',
    cre_by_nm: 'System',
    cre_ts: new Date().toISOString(),
    updt_by_nm: 'System',
    updt_ts: new Date().toISOString()
  };


try {
    const response = await axios.post(`${API_URL}/resource-profiles`, formattedData);
    // console.log('response.data', response.data);
    const { ds_attr_grp_instc_prof_id } = response.data;

    return {
    ...response.data,
    id: ds_attr_grp_instc_prof_id // Ensure we have a standard id field
  };
    
  } catch (error) {
    // Extract the detailed error message from the AxiosError
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

export const putResourceProfile = async (id, sourceData) => {
  const response = await axios.put(`${API_URL}/resource-profiles/${id}`, sourceData);
  return response.data;
};

export const deleteResourceProfile = async (id) => {
  await axios.delete(`${API_URL}/resource-profiles/${id}`);
};
