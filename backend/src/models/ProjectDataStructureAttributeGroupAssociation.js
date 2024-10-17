const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class ProjectDataStructureAttributeGroupAssociation extends Model {}

ProjectDataStructureAttributeGroupAssociation.init({
    proj_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'projects',  // References the 'proj' table
            key: 'proj_id'
        }
    },
    ds_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    data_strc_attr_grp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'dsstrc_attr_grp',  // References the 'dsstrc_attr_grp' table
            key: 'dsstrc_attr_grp_id'
        }
    },
    stdiz_abrvd_attr_grp_nm: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    cloned_data_strc_def_attr_grp_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cloned_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    shrd_ind: {
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
    cre_ts: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cre_by_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    updt_ts: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updt_by_nm: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,

    tableName: 'proj_dsstrc_attr_grp_assc',
    // modelName: 'ProjectDataStructureAttributeGroupAssociation',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = ProjectDataStructureAttributeGroupAssociation;
