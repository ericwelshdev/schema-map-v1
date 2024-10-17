// backend/src/models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const User = sequelize.define('User', {
  usr_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  first_nm: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_nm: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email_add_txt: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  usr_nm: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pswd_hash_txt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  force_pswd_chg_ind: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  enbld_ind: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login_ts: {
    type: DataTypes.DATE,
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
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  updt_by_nm: {
    type: DataTypes.STRING,
    allowNull: true
  },
  updt_ts: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'usr',
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = User;
