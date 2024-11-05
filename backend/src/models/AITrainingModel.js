// backend/src/models/AITrainingModel.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class AITrainingModel extends Model {}

AITrainingModel.init({
    model_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    model_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model_data: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    metrics: {
        type: DataTypes.JSON
    },
    training_status: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'ai_training_models',
    timestamps: true
});

module.exports = AITrainingModel;
