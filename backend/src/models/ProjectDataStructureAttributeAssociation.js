const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class ProjectDataStructureAttributeAssociation extends Model {}

ProjectDataStructureAttributeAssociation.init({
    proj_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'projects',  // References the 'proj' table
            key: 'proj_id'
        }
    },
    src_ds_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    trgt_ds_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    src_data_strc_def_attr_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'dsstrc_attr',  // References the 'dsstrc_attr' table
            key: 'dsstrc_attr_id'
        }
    },
    trgt_data_strc_def_attr_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'dsstrc_attr',  // References the 'dsstrc_attr' table
            key: 'dsstrc_attr_id'
        }
    },
    cmt_txt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    enbld_ind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ai_tag_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true
    },
    user_tag_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.JSON),
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

    tableName: 'proj_dsstrc_attr_assc',
    // modelName: 'ProjectDataStructureAttributeAssociation',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = ProjectDataStructureAttributeAssociation;
