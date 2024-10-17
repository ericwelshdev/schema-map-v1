const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class DataStructureAttributeAssociation extends Model {}

DataStructureAttributeAssociation.init({
    ds_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    stdiz_abrvd_attr_grp_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dsstrc_attr_grp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    stdiz_abrvd_attr_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dsstrc_attr_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    assct_ds_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assct_stdiz_abrvd_attr_grp_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assct_dsstrc_attr_grp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    assct_stdiz_abrvd_attr_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    assct_dsstrc_attr_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    techncl_rule_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dsstrc_attr_grp_assc_typ_cd: {
        type: DataTypes.ENUM('Source -> Target', 'Data Dictionary -> Target', 'Data Dictionary -> Source'),
        allowNull: true
    },
    ai_tag_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.STRING), // Define appropriate datatype for array
        allowNull: true
    },
    user_tag_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.STRING), // Define appropriate datatype for array
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
    tableName: 'dsstrc_attr_assc',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = DataStructureAttributeAssociation;
