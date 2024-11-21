const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class DataStructureAttributeGroup extends Model {}

DataStructureAttributeGroup.init({
    ds_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dsstrc_attr_grp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    stdiz_abrvd_attr_grp_nm: {
        type: DataTypes.STRING,        
        allowNull: false
    },
    dsstrc_attr_grp_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dsstrc_attr_grp_shrt_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dsstrc_attr_grp_desc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dsstrc_attr_grp_src_typ_cd: {
        type: DataTypes.ENUM('Source', 'Target', 'Data Dictionary'),
        allowNull: true
    },
    pii_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    phi_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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

    tableName: 'dsstrc_attr_grp',
    // modelName: 'DataStructureAttributeGroup',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = DataStructureAttributeGroup;
