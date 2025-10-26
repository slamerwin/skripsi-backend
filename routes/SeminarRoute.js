import express from "express";
import {
    getJadwal,
    getJadwalByPeriode,
    getJadwalByMhs,
    getJadwalByProp,
    getJadwalById,
    createJadwal,
    updateSimpanJadwal,
    simpanTandaTangan,
    updateJadwal,
    tandaiLulus,
    tandaiGagal,
    deleteJadwal
} from "../controllers/Seminar.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/seminars',verifyUser, getJadwal);
router.get('/seminare/:id',verifyUser, getJadwalByPeriode);
router.get('/seminarm/:stt',verifyUser, getJadwalByMhs);
router.get('/seminarp/:id',verifyUser, getJadwalByProp);
router.get('/seminars/:id',verifyUser, getJadwalById);
router.post('/seminars',verifyUser, createJadwal);
router.post('/seminard',verifyUser, updateSimpanJadwal);
router.patch('/seminarttd/:penilai/:id',verifyUser, simpanTandaTangan);
router.patch('/seminars/:id',verifyUser, updateJadwal);
router.patch('/seminarl/:id',verifyUser, tandaiLulus);
router.patch('/seminarg/:id',verifyUser, tandaiGagal);
router.delete('/seminars/:id',verifyUser, deleteJadwal);

export default router;