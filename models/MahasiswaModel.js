import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Prodi from "./ProdiModel.js";

const {DataTypes} = Sequelize;

const Mahasiswa = db.define('mahasiswa',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nim:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 20]
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
    nomor_handphone:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [1, 15]
        }
    },
    id_prodi:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_user:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

Users.hasMany(Mahasiswa);
Mahasiswa.belongsTo(Users, {foreignKey: 'id_user'});
Prodi.hasMany(Mahasiswa);
Mahasiswa.belongsTo(Prodi,{foreignKey: 'id_prodi'})

export default Mahasiswa;