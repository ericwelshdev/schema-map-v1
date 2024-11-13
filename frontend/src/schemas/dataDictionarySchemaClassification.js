export const schemaClassificationOptions = [
    { 
      group: 'Mandatory',
      options: [
        { 
          value: 'stdiz_abrvd_attr_grp_nm', 
          label: 'Physical Table Name',
          anti_patterns: {
            terms: ['logical', 'entity'],
        },
          properties: {
            prefix: 'Common prefixes like table, tbl_, dim_',
            suffix: 'Common suffixes like _tbl, _base',
            character_pattern: 'Regular expression patterns',
            word_count: 'Expected number of words',
          },
          tags: ['table', 'physical', 'name', 'mandatory'],
          classification_description: 'Identifies the physical name of a table in a database.'
        },
        { 
          value: 'stdiz_abrvd_attr_nm', 
          label: 'Physical Column Name',
          anti_patterns: {
            terms: ['logical', 'attribute'],
        },          
          properties: {
            prefix: 'Common prefixes like column, col_, attr_',
            suffix: 'Common suffixes like _id, _key',
            character_pattern: 'Regular expression patterns',
            word_count: 'Expected number of words',
          },
          tags: ['column', 'physical', 'name', 'mandatory'],
          classification_description: 'Identifies the physical name of a column in a table.'
        }
      ]
    },
    {
      group: 'Optional',
      options: [
        { 
          value: 'dsstrc_attr_grp_nm', 
          label: 'Logical Table Name',
          anti_patterns: {
            terms: ['physical', 'actual', 'raw'],
            patterns: ['phy_*', 'tbl_*', 'raw_*', 'physical_*', 'table_*', 'actual_*', 'raw_*'],
        },
          properties: {
            description_similarity: 'Measure of similarity to known logical table descriptions',
            semantic_meaning: 'Words with business logic relevance',
          },
          tags: ['table', 'logical', 'name', 'entity', 'optional'],
          classification_description: 'Represents the logical name of a table, often used in business contexts.'
        },
        { 
          value: 'dsstrc_attr_nm', 
          label: 'Logical Column Name',
          anti_patterns: {
            terms: ['physical', 'actual', 'raw'],
            patterns: ['phy_*', 'col_*', 'raw_*', 'physical_*', 'column_*', 'actual_*', 'raw_*'],
        },
          properties: {
            description_similarity: 'Measure of similarity to known logical column descriptions',
            semantic_meaning: 'Words with business logic relevance',
          },
        tags: ['column', 'logical', 'name',  'attribute', 'optional'],
          classification_description: 'Represents the logical name of a column, reflecting its business significance.'
        },
        { 
          value: 'dsstrc_attr_grp_desc', 
          label: 'Table Description',
          properties: {
            word_count: 'Range of expected word count',
            semantic_density: 'Ratio of words carrying semantic meaning to total words',
          },
          tags: ['table', 'description',  'desc', 'optional'],
          classification_description: 'Provides a detailed description of the purpose and content of the table.'
        },
        { 
          value: 'dsstrc_attr_desc', 
          label: 'Column Description',
          properties: {
            word_count: 'Range of expected word count',
            semantic_density: 'Ratio of words carrying semantic meaning to total words',
          },
          tags: ['column', 'description', 'optional'],
          classification_description: 'Gives an overview of what data the column holds and its significance.'
        },
        { 
          value: 'physcl_data_typ_nm', 
          label: 'Data Type',
          properties: {
            data_category: 'Categorization of data type (e.g., numeric, string, date)',
            size_range: 'Expected size range for the data type',
          },
        tags: ['data', 'type', 'data_type', 'data type', 'optional'],
          classification_description: 'Specifies the type of data stored in a column (e.g., integer, varchar).'
        },
        { 
          value: 'dsstrc_attr_seq_nbr', 
          label: 'Column Sequence',
          properties: {
            numeric_range: 'Expected numeric range for sequence numbers',
          },
          tags: ['column', 'sequence', 'seq', 'order', 'ord', 'optional'],
          classification_description: 'Denotes the order of columns within a table. '
        },
        { 
          value: 'len_nbr', 
          label: 'Length',
          properties: {
            numeric_range: 'Expected numeric range for length values',
          },
          tags: ['length', 'len', 'optional'],
          classification_description: 'Defines the maximum length of data stored in a column.'
        },
        { 
          value: 'prscn_nbr', 
          label: 'Precision',
          properties: {
            numeric_range: 'Expected numeric range for precision values',
          },
          tags: ['precision', 'optional'],
          classification_description: 'Indicates the number of significant digits for numeric data types.'
        },
        { 
          value: 'scale_nbr', 
          label: 'Scale',
          properties: {
            numeric_range: 'Expected numeric range for scale values',
          },
          tags: ['scale', 'optional'],
          classification_description: 'Specifies the number of digits to the right of the decimal point in a number.'
        },
        { 
          value: 'mand_ind', 
          label: 'Nullable Indicator',
          // prefix: 'Common prefixes like allow , nulls , nullabltiy , manditory',
          // suffix: 'Common suffixes like flag, ind, indicator, null, nullability',
          properties: {
            boolean_value: 'Expected boolean values (e.g., Y, N)',
          },
          tags: ['nullable', 'indicator', 'null', 'manditory', 'optional'],
          classification_description: 'Indicates whether a column can contain null values.'
        },
        { 
          value: 'pk_ind', 
          label: 'Primary Key',
          properties: {
            boolean_value: 'Expected boolean values (e.g., Y, N)',
          },
          tags: ['primary', 'key', 'pk', 'optional'],
          classification_description: 'Denotes if a column is part of the table\'s primary key.'
        },
        { 
          value: 'fk_ind', 
          label: 'Foreign Key',
          properties: {
            boolean_value: 'Expected boolean values (e.g., Y, N)',
          },
        tags: ['foreign', 'key', 'fk', 'optional'],
          classification_description: 'Indicates if a column is a foreign key, linking to another table.'
        },
        { 
          value: 'phi_ind', 
          label: 'PHI Indicator',
          properties: {
            boolean_value: 'Expected boolean values (e.g., Y, N)',
          },
          tags: ['PHI', 'indicator', 'personal health', 'optional'],
          classification_description: 'Marks if a column contains Protected Health Information.'
        },
        { 
          value: 'pii_ind', 
          label: 'PII Indicator',
          properties: {
            boolean_value: 'Expected boolean values (e.g., Y, N)',
          },
          tags: ['PII', 'indicator', 'personal identification', 'optional'],
          classification_description: 'Identifies if a column holds Personally Identifiable Information.'
        },
        { 
          value: 'encrypt_ind', 
          label: 'Encryption Indicator',
          properties: {
            boolean_value: 'Expected boolean values (e.g., Y, N)',
          },
          tags: ['encryption', 'indicator', 'optional'],
          classification_description: 'Specifies if the data in a column is encrypted for security purposes.'
        }
      ]
    }
  ];

export const mlConfig = {
    confidenceThresholds: {
        minimum: 0.4,  // Below this, no classification is applied
        low: 0.41,      // Show warning for low confidence
        medium: 0.5,   // Show neutral confidence
        high: 0.8      // Show high confidence
    }
};
