import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Mahasiswa from "./MahasiswaModel.js";
import Dosen from "./DosenModel.js";

const {DataTypes} = Sequelize;

const Logriset = db.define('logriset',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    label:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    keterangan:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_proposal:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_dosen:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{
    freezeTableName: true
});

Mahasiswa.hasMany(Logriset);
Logriset.belongsTo(Mahasiswa, {foreignKey: 'id_mahasiswa'});
Dosen.hasMany(Logriset);
Logriset.belongsTo(Dosen, {foreignKey: 'id_dosen'});

export default Logriset;