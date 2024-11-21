const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');
const DataStructureAttributeGroup = require('./DataStructureAttributeGroup');

class DataStructureAttribute extends Model {}

DataStructureAttribute.init({
    ds_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },    
    dsstrc_attr_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dsstrc_attr_grp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stdiz_abrvd_attr_grp_nm: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dsstrc_attr_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },   
    dsstrc_alt_attr_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },       
    dsstrc_attr_desc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stdiz_abrvd_attr_nm: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stdiz_abrvd_alt_attr_nm: {
        type: DataTypes.STRING,
        allowNull: false
    },    
    dsstrc_attr_seq_nbr: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    physcl_data_typ_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mand_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    pk_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fk_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },    
    encrypt_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    pii_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    phi_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    disabld_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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

    tableName: 'dsstrc_attr',
    // modelName: 'DataStructureAttribute',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = DataStructureAttribute;
