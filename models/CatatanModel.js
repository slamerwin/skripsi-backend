import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Dosen from "./DosenModel.js";

const {DataTypes} = Sequelize;

const Catatan = db.define('catatan',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_seminar_sidang:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nama_field:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_penilai:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    kegiatan:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    catatan:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

Dosen.hasMany(Catatan);
Catatan.belongsTo(Dosen, {foreignKey: 'id_penilai'});

export default Catatan;