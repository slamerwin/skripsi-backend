import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Prodi from "./ProdiModel.js";

const {DataTypes} = Sequelize;

const Dosen = db.define('dosen',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nidn:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [10]
        }
    },
    guna_nidn:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nip:{
        type: DataTypes.STRING,
        allowNull: true
    },
    nama:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
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

Users.hasMany(Dosen);
Dosen.belongsTo(Users, {foreignKey: 'id_user'});
Prodi.hasMany(Dosen);
Dosen.belongsTo(Prodi,{foreignKey: 'id_prodi'})

export default Dosen;