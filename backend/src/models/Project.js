const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class Project extends Model {}

Project.init({
    proj_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    usr_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usr', // Name of the related table
            key: 'usr_id'
        }
    },
    proj_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    proj_desc: {
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

    tableName: 'proj',
    // modelName: 'Project',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = Project;
