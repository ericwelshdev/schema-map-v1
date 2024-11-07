import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getResourceAttribute = async () => {
  const response = await axios.get(`${API_URL}/resource-attributes`);
  return response.data;
};

export const postResourceAttribute = async (sourceAttrbute) => {
  try {
    const data = {
      ds_id: 0,
      dsstrc_attr_id: null,
      dsstrc_attr_nm: sourceAttrbute?.dsstrc_attr_nm,
      dsstrc_attr_grp_id: sourceAttrbute.dsstrc_attr_grp_id,
      stdiz_abrvd_attr_grp_nm: sourceAttrbute.stdiz_abrvd_attr_grp_nm,
      abrvd_attr_nm: sourceAttrbute.abrvd_attr_nm,
      stdiz_abrvd_attr_nm: sourceAttrbute.stdiz_abrvd_attr_nm,
      stdiz_abrvd_alt_attr_nm: sourceAttrbute?.stdiz_abrvd_alt_attr_nm,
      dsstrc_attr_desc: sourceAttrbute.dsstrc_attr_desc,
      dsstrc_attr_seq_nbr: sourceAttrbute.dsstrc_attr_seq_nbr,
      physcl_data_typ_nm: sourceAttrbute.physcl_data_typ_nm,
      mand_ind: sourceAttrbute.mand_ind,
      pk_ind: sourceAttrbute.pk_ind,
      fk_ind: sourceAttrbute.fk_ind,
      encrypt_ind: sourceAttrbute.encrypt_ind,
      pii_ind: sourceAttrbute.pii_ind,
      phi_ind: sourceAttrbute.phi_ind,
      disabld_ind: sourceAttrbute.disabld_ind,
      user_tag_cmplx: sourceAttrbute.user_tag_cmplx,
      ai_tag_cmplx: sourceAttrbute.ai_tag_cmplx,
      meta_tag_cmplx: sourceAttrbute.meta_tag_cmplx,
      usr_cmt_txt: sourceAttrbute.usr_cmt_txt,
      oprtnl_stat_cd: sourceAttrbute.oprtnl_stat_cd,
      cre_by_nm: 'System',
      cre_ts: new Date().toISOString(),
      updt_by_nm: 'System',
      updt_ts: new Date().toISOString()
    };



    const response = await axios.post(`${API_URL}/resource-attributes`, data);
    // console.log('response.data', response.data);
    const { dsstrc_attr_grp_id } = response.data;

    return {
    ...response.data,
    id: dsstrc_attr_grp_id // Ensure we have a standard id field
  };
    
  } catch (error) {
    // Extract the detailed error message from the AxiosError
    const errorDetails = error.response?.data?.error;
    const errorMessage = `${errorDetails?.name}: ${errorDetails?.message}`;
    const detailedErrors = errorDetails?.details?.map(d => 
      `${d.field}: ${d.type} - ${d.message}`
    ).join('\n');
    
    throw new Error(`${errorMessage}\n${detailedErrors}`);
  }
};

export const putResourceAttribute = async (id, sourceAttrbute) => {
  const response = await axios.put(`${API_URL}/resource-attributes/${id}`, sourceAttrbute);
  return response.data;
};

export const deleteResourceAttribute = async (id) => {
  await axios.delete(`${API_URL}/resource-attributes/${id}`);
};

// Bulk create source attributes


export const postBulkResourceAttribute = async (sourceAttributes) => {
  // console.log('postBulkSourceAttribute Input column data:', sourceAttributes);
  try {
    const formattedData = sourceAttributes.attributes.map(attr => ({
      ds_id: 0,
      dsstrc_attr_id: null,
      dsstrc_attr_nm: attr?.dsstrc_attr_nm,
      dsstrc_attr_grp_id: attr.dsstrc_attr_grp_id,
      stdiz_abrvd_attr_grp_nm: attr.stdiz_abrvd_attr_grp_nm,
      abrvd_attr_nm: attr.abrvd_attr_nm,
      stdiz_abrvd_attr_nm: attr.stdiz_abrvd_attr_nm,
      stdiz_abrvd_alt_attr_nm: attr?.stdiz_abrvd_alt_attr_nm,
      dsstrc_attr_desc: attr.dsstrc_attr_desc,
      dsstrc_attr_seq_nbr: attr.dsstrc_attr_seq_nbr,
      physcl_data_typ_nm: attr.physcl_data_typ_nm,
      mand_ind: attr.mand_ind,
      pk_ind: attr.pk_ind,
      fk_ind: attr.fk_ind,
      encrypt_ind: attr.encrypt_ind,
      pii_ind: attr.pii_ind,
      phi_ind: attr.phi_ind,
      disabld_ind: attr.disabld_ind,
      user_tag_cmplx: attr.user_tag_cmplx,
      ai_tag_cmplx: attr.ai_tag_cmplx,
      meta_tag_cmplx: attr.meta_tag_cmplx,
      usr_cmt_txt: attr.usr_cmt_txt,
      oprtnl_stat_cd: attr.oprtnl_stat_cd,
      cre_by_nm: 'System',
      cre_ts: new Date().toISOString(),
      updt_by_nm: 'System',
      updt_ts: new Date().toISOString()
    }));
    console.log('!!! postBulkSourceAttribute Sending column data:', formattedData); // to verify the array
    const response = await axios.post(`${API_URL}/resource-attributes/bulk`, formattedData);
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