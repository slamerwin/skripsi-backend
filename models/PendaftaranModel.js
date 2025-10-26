import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Ceklis from "./CeklisModel.js";
import Proposal from "./ProposalModel.js";
 
const {DataTypes} = Sequelize;

const Pendaftaran = db.define('pendaftaran',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
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
    id_ceklis:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    keterangan:{
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: true
    },
    lengkap:{
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

Proposal.hasMany(Pendaftaran);
Pendaftaran.belongsTo(Proposal,{foreignKey: 'id_proposal'});
Ceklis.hasMany(Pendaftaran);
Pendaftaran.belongsTo(Ceklis,{foreignKey: 'id_ceklis'});

export default Pendaftaran;