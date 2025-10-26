import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Dosen from "./DosenModel.js";
import Users from "./UserModel.js";
import Prodi from "./ProdiModel.js";

const {DataTypes} = Sequelize;

const Kaprodi = db.define('kaprodi',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_dosen:{
        type: DataTypes.INTEGER,
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

Dosen.hasMany(Kaprodi);
Kaprodi.belongsTo(Dosen, {foreignKey: 'id_dosen'});
Users.hasMany(Kaprodi);
Kaprodi.belongsTo(Users, {foreignKey: 'id_user'});
Prodi.hasMany(Kaprodi);
Kaprodi.belongsTo(Prodi,{foreignKey: 'id_prodi'})

export default Kaprodi;