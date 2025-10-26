import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import SkemaFormulir from "./SkemaFormulirModel.js";
import Dosen from "./DosenModel.js";

const {DataTypes} = Sequelize;

const Nilai = db.define('nilai',{
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
    id_skema_formulir:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nilai:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

SkemaFormulir.hasMany(Nilai);
Nilai.belongsTo(SkemaFormulir, {foreignKey: 'id_skema_formulir'});
Dosen.hasMany(Nilai);
Nilai.belongsTo(Dosen, {foreignKey: 'id_penilai'});

export default Nilai;