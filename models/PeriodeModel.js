import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Periode = db.define('periode',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    kode_semester:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [5]
        }
    },
    tahun_ajaran:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [9]
        }
    },
    jenis:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    tanggal_mulai:{
        type: DataTypes.DATE,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    tanggal_selesai:{
        type: DataTypes.DATE,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    keterangan:{
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    freezeTableName: true
});

export default Periode;