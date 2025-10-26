import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Periode from "./PeriodeModel.js";
import Dosen from "./DosenModel.js";
import Proposal from "./ProposalModel.js";

const {DataTypes} = Sequelize;

const Sidang = db.define('sidang',{
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
    id_periode:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    waktu:{
        type: DataTypes.DATE,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ruang:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nomor_bap:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ketua_penguji:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ttd_ketua_penguji:{
	type:DataTypes.STRING(5000),
	allowNull: true
    },
    penguji_satu:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ttd_penguji_satu:{
	type:DataTypes.STRING(5000),
	allowNull: true
    },
    penguji_dua:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ttd_penguji_dua:{
	type:DataTypes.STRING(5000),
	allowNull: true
    },
    penguji_tiga:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ttd_penguji_tiga:{
	type:DataTypes.STRING(5000),
	allowNull: true
    },
    penguji_empat:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ttd_penguji_empat:{
	type:DataTypes.STRING(5000),
	allowNull: true
    }
},{
    freezeTableName: true
});

Periode.hasMany(Sidang);
Sidang.belongsTo(Periode, {foreignKey: 'id_periode'});
Proposal.hasMany(Sidang);
Sidang.belongsTo(Proposal, {foreignKey: 'id_proposal'});
Dosen.hasMany(Sidang);
Sidang.belongsTo(Dosen, {foreignKey: 'ketua_penguji'});
Dosen.hasMany(Sidang);
Sidang.belongsTo(Dosen, {foreignKey: 'penguji_satu'});
Dosen.hasMany(Sidang);
Sidang.belongsTo(Dosen, {foreignKey: 'penguji_dua'});
Dosen.hasMany(Sidang);
Sidang.belongsTo(Dosen, {foreignKey: 'penguji_tiga'});
Dosen.hasMany(Sidang);
Sidang.belongsTo(Dosen, {foreignKey: 'penguji_empat'});

export default Sidang;