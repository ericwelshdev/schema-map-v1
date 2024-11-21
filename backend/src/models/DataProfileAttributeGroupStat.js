const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const DataStructureAttributeGroup = require('./DataStructureAttributeGroup');
const Project = require('./Project');

class DataProfileAttributeGroupStat extends Model {}

DataProfileAttributeGroupStat.init({
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
    stdiz_abrvd_attr_grp_nm: {
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
    prof_instc_row_cnt: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_clmn_cnt: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_size_nbr: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_smpl_pct: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    prof_instc_dupe_row_cnt: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    prof_instc_dupe_clmn_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON, // Storing as JSON for MAP<STRING, STRING> equivalent
        allowNull: true
    },
    prof_instc_high_corrltd_clmn_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
        allowNull: true
    },
    prof_instc_skewed_dist_clmn_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
        allowNull: true
    },
    prof_instc_feat_leakage_clmn_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.JSON,
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

    tableName: 'dsstrc_attr_grp_instc_data_prof',
    // modelName: 'DataProfileAttributeGroupStat',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = DataProfileAttributeGroupStat;
