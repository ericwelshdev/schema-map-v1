const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const DataStructureAttribute = require('./DataStructureAttribute');
const Project = require('./Project');
const DataStructureAttributeGroup = require('./DataStructureAttributeGroup');

class DataProfileAttributeStat extends Model {}

DataProfileAttributeStat.init({
    ds_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    dsstrc_attr_grp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DataStructureAttributeGroup, // Reference to DataStructureAttributeGroup
            key: 'dsstrc_attr_grp_id'
        },
        primaryKey: true
    },    
    dsstrc_attr_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DataStructureAttribute, // Reference to DataStructureAttribute
            key: 'dsstrc_attr_id'
        },
        primaryKey: true
    },
    stdiz_abrvd_attr_nm: {
        type: DataTypes.STRING,
        allowNull: true,
        primaryKey: true
    },
    proj_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Project, // Reference to Project model
            key: 'proj_id'
        },
        primaryKey: true
    },
    prof_instc_data_typ_cd: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_clmn_cnt: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_null_val_cnt: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_blank_val_cnt: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_emplty_strg_cnt: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_distict_val_cnt: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_miss_val_cnt: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    prof_instc_min_clmn_len: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    prof_instc_max_clmn_len: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    prof_instc_min_val: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prof_instc_max_val: {
        type: DataTypes.STRING,
        allowNull: true
    },
    prof_instc_mixed_data_typ_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_mixed_data_typ_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON, // Using JSON to store MAP<STRING, STRING>
        allowNull: true
    },
    prof_instc_high_crdnlty_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_high_crdnlty_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON
        allowNull: true
    },
    prof_instc_high_corrltd_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_dupe_clmn_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_id_cand_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_zero_vrnc_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_zero_vrnc_val_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
        allowNull: true
    },
    prof_instc_infinite_val_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_infinite_val_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
        allowNull: true
    },
    prof_instc_otlr_val_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_otlr_val_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
        allowNull: true
    },
    prof_instc_skewed_dist_val_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
        allowNull: true
    },
    prof_instc_skewed_dist_score_fct: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
        allowNull: true
    },
    prof_instc_imbald_clas_score_pct: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    prof_instc_imbald_clas_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
        allowNull: true
    },
    prof_instc_feat_leakage_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    prof_instc_smpl_val_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    ai_tag_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    usr_tag_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    meta_tag_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    ai_cmt_txt: {
        type: DataTypes.STRING,
        allowNull: true
    },    
    usr_cmt_txt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    oprtnl_stat_cd: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cre_by_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cre_ts: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updt_by_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    updt_ts: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,

    tableName: 'dsstrc_attr_instc_data_prof',
    // modelName: 'DataProfileAttributeStat',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = DataProfileAttributeStat;
