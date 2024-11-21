const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class DataStructureAttributeGroupAssociation extends Model {}

DataStructureAttributeGroupAssociation.init({
    
    dsstrc_attr_grp_assc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ds_id: {
        type: DataTypes.INTEGER,
    },
    dsstrc_attr_grp_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stdiz_abrvd_attr_grp_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assct_ds_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assct_dsstrc_attr_grp_id: {
        type: DataTypes.INTEGER,
    },
    assct_stdiz_abrvd_attr_grp_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    techncl_rule_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dsstrc_attr_grp_assc_typ_cd: {
        type: DataTypes.ENUM('Source -> Target', 'Target -> Data Dictionary', 'Source -> Data Dictionary'),
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
    tableName: 'dsstrc_attr_grp_assc',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = DataStructureAttributeGroupAssociation;
