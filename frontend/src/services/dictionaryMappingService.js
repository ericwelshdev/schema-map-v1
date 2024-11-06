
// frontend/src/services/dictionaryMappingService.js
export const mapDictionaryData = (sourceData, additionalProperties) => {
    const mappedData = sourceData.map(entry => {
        const baseMapping = {
            stdiz_abrvd_attr_grp_nm: entry.tableName,
            stdiz_abrvd_attr_nm: entry.columnName,
            dsstrc_attr_grp_nm: entry.logicalTableName,
            dsstrc_attr_grp_desc: entry.logicalColumnName,
            physcl_data_typ_nm: entry.dataType,
            dsstrc_attr_desc: entry.columnDescription,
            len_nbr: entry.columnLength,
            scale_nbr: entry.columnScale,
            mand_ind: entry.isNullable ? 'YES' : 'NO',
            pk_ind: entry.isPrimaryKey ? 'YES' : 'NO',
            fk_ind: entry.isForeignKey ? 'YES' : 'NO',
            phi_ind: entry.isPHI ? 'YES' : 'NO',
            pii_ind: entry.isPII ? 'YES' : 'NO',
            encrypt_ind: entry.isEncryptioned ? 'YES' : 'NO'
        };

        // Append additional properties from the data grid
        return {
            ...baseMapping,
            dsstrc_alt_attr_nm: additionalProperties.alternativeName || '',
            usr_cmt_txt: additionalProperties.comment || '',
            disabld_ind: additionalProperties.isDisabled || false,
            user_tag_cmplx: JSON.stringify(additionalProperties.tags || [])
        };
    });

    return mappedData;
};
