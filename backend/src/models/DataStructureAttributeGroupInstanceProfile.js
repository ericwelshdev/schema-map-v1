const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../config/db');

class DataStructureAttributeGroupInstanceProfile extends Model {}

DataStructureAttributeGroupInstanceProfile.init({
    ds_attr_grp_instc_prof_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        //  autoIncrement: true, // Equivalent to GENERATED BY DEFAULT AS IDENTITY
        allowNull: false
    },
    ds_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    dsstrc_attr_grp_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },    
    stdiz_abrvd_attr_grp_nm: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    ds_instc_data_cntnt_typ_cd: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ds_instc_data_cntnt_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ds_instc_data_cntnt_min_dt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ds_instc_data_cntnt_max_dt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    par_ds_instc_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    ds_instc_physcl_nm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ds_instc_loc_txt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ds_instc_arrival_dt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ds_instc_publd_dt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ds_instc_row_cnt: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    ds_instc_size_nbr: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    ds_instc_comprsn_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    ds_instc_file_cnt: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    ds_instc_chksum_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ds_instc_part_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    ds_instc_late_arrival_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    ds_instc_resupply_ind: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'dsstrc_attr_grp_instc_prof',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

module.exports = DataStructureAttributeGroupInstanceProfile;