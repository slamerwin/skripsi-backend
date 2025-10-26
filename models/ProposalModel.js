import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Dosen from "./DosenModel.js";
import Mahasiswa from "./MahasiswaModel.js";
import Prodi from "./ProdiModel.js";

const {DataTypes} = Sequelize;

const Proposal = db.define('proposal',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    id_mahasiswa:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    judul:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    link_drive:{
        type: DataTypes.STRING,
        allowNull: true
    },
    pembimbing_satu:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    setuju_pembimbing_satu:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    tgl_setuju_pemb_satu:{
        type: DataTypes.DATE,
        allowNull: true
    },
    pembimbing_dua:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    setuju_pembimbing_dua:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    tgl_setuju_pemb_dua:{
        type: DataTypes.DATE,
        allowNull: true
    },
    id_prodi:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    freezeTableName: true
});

Mahasiswa.hasMany(Proposal);
Proposal.belongsTo(Mahasiswa, {foreignKey: 'id_mahasiswa'});
Dosen.hasMany(Proposal);
Proposal.belongsTo(Dosen, {foreignKey: 'pembimbing_satu'});
Dosen.hasMany(Proposal);
Proposal.belongsTo(Dosen, {foreignKey: 'pembimbing_dua'});
Prodi.hasMany(Proposal);
Proposal.belongsTo(Prodi,{foreignKey: 'id_prodi'})

export default Proposal;