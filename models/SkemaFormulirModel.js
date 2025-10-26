import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Formulir from "./FormulirModel.js";
 
const {DataTypes} = Sequelize;

const SkemaFormulir = db.define('skema_formulir',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nama_nilai:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    bobot:{
        type: DataTypes.FLOAT,
        defaultValue: 1.0,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_formulir:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

Formulir.hasMany(SkemaFormulir);
SkemaFormulir.belongsTo(Formulir,{foreignKey: 'id_formulir'})

export default SkemaFormulir;