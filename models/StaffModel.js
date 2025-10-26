import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Prodi from "./ProdiModel.js";

const {DataTypes} = Sequelize;

const Staff = db.define('staff',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
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

Users.hasMany(Staff);
Staff.belongsTo(Users, {foreignKey: 'id_user'});
Prodi.hasMany(Staff);
Staff.belongsTo(Prodi,{foreignKey: 'id_prodi'})

export default Staff;