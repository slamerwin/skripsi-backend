import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Prodi from "./ProdiModel.js";
 
const {DataTypes} = Sequelize;

const Formulir = db.define('formulir',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
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
    nama_field:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    keterangan:{
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    aktif:{
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_prodi:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

Prodi.hasMany(Formulir);
Formulir.belongsTo(Prodi,{foreignKey: 'id_prodi'})

export default Formulir;