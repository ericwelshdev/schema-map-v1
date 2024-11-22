import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getResourceAttributeAssociations = async () => {
  const response = await axios.get(`${API_URL}/resource-attribute-associations`);
  return response.data;
};

export const postResourceAttributeAssociation = async (sourceAttrbute) => {
  const formattedData = {
    dsstrc_attr_assc_id: null,
    dsstrc_attr_grp_assc_id: sourceAttrbute.dsstrc_attr_grp_assc_id,
    ds_id: 0, 
    dsstrc_attr_grp_id: sourceAttrbute.dsstrc_attr_grp_id,
    stdiz_abrvd_attr_grp_nm: sourceAttrbute.stdiz_abrvd_attr_grp_nm,
    dsstrc_attr_id: sourceAttrbute.dsstrc_attr_id,
    stdiz_abrvd_attr_nm: sourceAttrbute.stdiz_abrvd_attr_nm,
    assct_ds_id: sourceAttrbute.assct_ds_id,
    assct_dsstrc_attr_grp_id: sourceAttrbute.assct_dsstrc_attr_grp_id,
    assct_stdiz_abrvd_attr_grp_nm: sourceAttrbute.assct_stdiz_abrvd_attr_grp_nm,
    assct_dsstrc_attr_id: sourceAttrbute.assct_dsstrc_attr_id,
    assct_stdiz_abrvd_attr_nm: sourceAttrbute.assct_stdiz_abrvd_attr_nm,
    techncl_rule_nm: sourceAttrbute.techncl_rule_nm,
    dsstrc_attr_assc_typ_cd: sourceAttrbute.dsstrc_attr_assc_typ_cd,
    ai_tag_cmplx: sourceAttrbute.ai_tag_cmplx,
    usr_tag_cmplx: sourceAttrbute.usr_tag_cmplx,
    meta_tag_cmplx: sourceAttrbute.meta_tag_cmplx,
    ai_cmt_txt: sourceAttrbute.ai_cmt_txt,
    usr_cmt_txt: sourceAttrbute.usr_cmt_txt,
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
    const errorDetails = error.response?.data?.error;
    const errorMessage = `${errorDetails?.name}: ${errorDetails?.message}`;
    const detailedErrors = errorDetails?.details?.map(d => 
      `${d.field}: ${d.type} - ${d.message}`
    ).join('\n');
    
    throw new Error(`${errorMessage}\n${detailedErrors}`);
  }
};

export const putResourceAttributeAssociation = async (id, sourceAttrbute) => {
  const response = await axios.put(`${API_URL}/resource-attribute-associations/${id}`, sourceAttrbute);
  return response.data;
};

export const deleteResourceAttributeAssociation = async (id) => {
  await axios.delete(`${API_URL}/resource-attribute-associations/${id}`);
};

// Bulk create source attributes
export const postBulkResourceAttributeAssociation = async (sourceAttributes) => {
  // console.log('postBulkSourceAttributeAssociation Input column data:', sourceAttributes);
  try {
    const formattedData = sourceAttributes.attributes.map(attr => ({
    dsstrc_attr_assc_id: null,
    dsstrc_attr_grp_assc_id: attr.dsstrc_attr_grp_assc_id,
    ds_id: 0, 
    dsstrc_attr_grp_id: attr.dsstrc_attr_grp_id,
    stdiz_abrvd_attr_grp_nm: attr.stdiz_abrvd_attr_grp_nm,
    dsstrc_attr_id: attr.dsstrc_attr_id,
    stdiz_abrvd_attr_nm: attr.stdiz_abrvd_attr_nm,
    assct_ds_id: 0,
    assct_dsstrc_attr_grp_id: attr.assct_dsstrc_attr_grp_id,
    assct_stdiz_abrvd_attr_grp_nm: attr.assct_stdiz_abrvd_attr_grp_nm,
    assct_dsstrc_attr_id: attr.assct_dsstrc_attr_id,
    assct_stdiz_abrvd_attr_nm: attr.assct_stdiz_abrvd_attr_nm,
    techncl_rule_nm: attr.techncl_rule_nm,
    dsstrc_attr_assc_typ_cd: attr.dsstrc_attr_assc_typ_cd,
    dsstrc_attr_assc_cnfdnc_pct: attr.dsstrc_attr_assc_cnfdnc_pct,
    ai_tag_cmplx: attr.ai_tag_cmplx,
    usr_tag_cmplx: attr.usr_tag_cmplx,
    meta_tag_cmplx: attr.meta_tag_cmplx,
    ai_cmt_txt: attr.ai_cmt_txt,
    usr_cmt_txt: attr.usr_cmt_txt,
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
//     console.log('postBulkSourceAttributeAssociation Sending column data:', formattedData); // to verify the array
    const response = await axios.post(`${API_URL}/resource-attribute-associations/bulk`, formattedData);
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



// Add new function to get columns by group ID
export const getResourceAttributeAssociationsByGroupId = async (dsstrc_attr_grp_id) => {
  console.log('getResourceAttributeAssociationsByGroupId | Fetching columns for group ID:', dsstrc_attr_grp_id);
  try {
    const response = await axios.get(`${API_URL}/resource-attribute-associations/group/${dsstrc_attr_grp_id}`);
    console.log('Fetching columns for group ID:', dsstrc_attr_grp_id);
    console.log('API Response:', response.data); 
    const columns = response.data.map(attr => ({
      dsstrc_attr_assc_id: attr.dsstrc_attr_assc_id,
      dsstrc_attr_grp_assc_id: attr.dsstrc_attr_grp_assc_id,
      ds_id: 0, 
      dsstrc_attr_grp_id: attr.dsstrc_attr_grp_id,
      stdiz_abrvd_attr_grp_nm: attr.stdiz_abrvd_attr_grp_nm,
      dsstrc_attr_id: attr.dsstrc_attr_id,
      stdiz_abrvd_attr_nm: attr.stdiz_abrvd_attr_nm,
      assct_ds_id: 0,
      assct_dsstrc_attr_grp_id: attr.assct_dsstrc_attr_grp_id,
      assct_stdiz_abrvd_attr_grp_nm: attr.assct_stdiz_abrvd_attr_grp_nm,
      assct_dsstrc_attr_id: attr.assct_dsstrc_attr_id,
      assct_stdiz_abrvd_attr_nm: attr.assct_stdiz_abrvd_attr_nm,
      techncl_rule_nm: attr.techncl_rule_nm,
      dsstrc_attr_assc_typ_cd: attr.dsstrc_attr_assc_typ_cd,
      dsstrc_attr_assc_cnfdnc_pct: attr.dsstrc_attr_assc_cnfdnc_pct,
    usr_cmt_txt: attr.usr_cmt_txt,
      tags: {
        user: JSON.parse(attr?.usr_tag_cmplx || '[]'),
        ai: JSON.parse(attr?.ai_tag_cmplx || '[]'),
        meta: JSON.parse(attr?.meta_tag_cmplx || '[]')
      },
      comments: {
        ai: JSON.parse(attr?.ai_cmt_txt || '[]'),
        user: JSON.parse(attr?.usr_cmt_txt || '[]')
      }
    }));
    console.log('Transformed Columns:', columns); 
    return columns;
  } catch (error) {
    console.log('Received error response:', error);
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