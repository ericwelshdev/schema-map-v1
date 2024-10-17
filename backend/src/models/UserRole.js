const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class UserRole extends Model {}

UserRole.init({
    usr_role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usr_role_desc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    usr_role_nm: {
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

    tableName: 'usr_role',
    // modelName: 'UserRole',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = UserRole;
