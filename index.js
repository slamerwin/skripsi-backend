import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import DosenRoute from "./routes/DosenRoute.js";
import SeminarRoute from "./routes/SeminarRoute.js";
import MahasiswaRoute from "./routes/MahasiswaRoute.js";
import PeriodeRoute from "./routes/PeriodeRoute.js";
import ProdiRoute from "./routes/ProdiRoute.js";
import ProposalRoute from "./routes/ProposalRoute.js";
import SkemaFormulirRoute from "./routes/SkemaFormulirRoute.js";
import FormulirRoute from "./routes/FormulirRoute.js";
import NilaiRoute from "./routes/NilaiRoute.js";
import SidangRoute from "./routes/SidangRoute.js";
import BapRoute from "./routes/BapRoute.js";
import CeklisRoute from "./routes/CeklisRoute.js";
import PendaftaranRoute from "./routes/PendaftaranRoute.js";
import KaprodiRoute from "./routes/KaprodiRoute.js";
import StaffRoute from "./routes/StaffRoute.js";
import LogRisetRoute from "./routes/LogRisetRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

/*(async()=>{
    await db.sync();
})();*/

// app.use(
//   session({
//     secret: process.env.SESS_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: store,
//     cookie: {
//       secure: "auto",
//     },
//   })
// );

app.use(
  session({
    secret: process.env.SESS_SECRET || "fallback_secret_123",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000", // untuk development lokal
      "https://apsium.administrasisekolah.id", // frontend di cPanel (HTTPS)
    ],
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(DosenRoute);
app.use(SeminarRoute);
app.use(MahasiswaRoute);
app.use(PeriodeRoute);
app.use(ProdiRoute);
app.use(ProposalRoute);
app.use(SkemaFormulirRoute);
app.use(FormulirRoute);
app.use(NilaiRoute);
app.use(SidangRoute);
app.use(BapRoute);
app.use(CeklisRoute);
app.use(PendaftaranRoute);
app.use(KaprodiRoute);
app.use(StaffRoute);
app.use(LogRisetRoute);
app.use(AuthRoute);

store.sync();

const PORT = process.env.PORT || 162; // fallback kalau lokal
app.listen(PORT, () => {
  console.log("Server up and running on port " + PORT);
});
