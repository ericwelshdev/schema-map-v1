const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Project extends Model {}

Project.init({
    proj_clct_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    proj_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'proj', // Name of the related table
            key: 'proj_id'
        }
    },
    proj_clct_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    proj_clct_desc: {
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

    tableName: 'proj_clct',
    // modelName: 'ProjectCollection',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = Project;
