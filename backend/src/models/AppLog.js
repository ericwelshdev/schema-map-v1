const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class AppLog extends Model {}

AppLog.init({
    evnt_log_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    exec_log_ts: {
        type: DataTypes.DATE,
        allowNull: true
    },
    evnt_log_typ_cd: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    actn_cd: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rsrc_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rsrc_txt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sevrty_lvl_cd: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    exec_stat_cd: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    exec_stat_msg_txt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    exec_stck_trace_err_txt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    exec_detl_cmplx: {
        type: DataTypes.STRING, // type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true
    },
    exec_usr_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    exec_usr_ip_addr_txt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    exec_usr_agnt_txt: {
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
    }
}, {
    sequelize,

    tableName: 'evnt_log',
    // modelName: 'AppLog',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = AppLog;
