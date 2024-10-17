const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class DataAccessMechanism extends Model {}

DataAccessMechanism.init({
    dacc_mechsm_cd: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        // autoIncrement: true, // GENERATED BY DEFAULT AS IDENTITY equivalent in Sequelize
        allowNull: false
    },
    dacc_mechsm_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dacc_mechsm_shrt_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dacc_mechsm_desc: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'dacc_mechsm',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = DataAccessMechanism;