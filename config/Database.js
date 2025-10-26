import {Sequelize} from "sequelize";
//skripsiportal_kaprodi
//=1PZ[{-$Ug[9
const db = new Sequelize('skripsi', 'root', '', {
    'host': "localhost",
    'dialect': "mysql",
    'timezone': "+07:00",
});

export default db;
