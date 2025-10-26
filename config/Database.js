import {Sequelize} from "sequelize";
//skripsiportal_kaprodi
//=1PZ[{-$Ug[9
const db = new Sequelize('railway', 'root', 'czoSXcgPHfXTgWKHwmApjHbFzXLrvBmy', {
    'host': "mysql.railway.internal",
    'dialect': "mysql",
    'timezone': "+07:00",
});

export default db;
