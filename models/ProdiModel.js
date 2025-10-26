import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Prodi = db.define('prodi',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nama:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    fakultas:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    uri:{
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    freezeTableName: true
});

export default Prodi;