import express from "express";
import {
    getMahasiswa,
    getMahasiswaById,
    getMahasiswaByNama,
    getMahasiswaByNamo,
    createMahasiswa,
    updateMahasiswa,
    updateCreateMahasiswa,
    deleteMahasiswa
} from "../controllers/Mahasiswa.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/mahasiswas',verifyUser, getMahasiswa);
router.get('/mahasiswas/:id',verifyUser, getMahasiswaById);
router.get('/mahasiswan/:nama',verifyUser, getMahasiswaByNama);
router.get('/mahasiswan/',verifyUser, getMahasiswaByNamo);
router.post('/mahasiswas',verifyUser, createMahasiswa);
router.patch('/mahasiswas/:id',verifyUser, updateMahasiswa);
router.post('/mahasiswacm',verifyUser, updateCreateMahasiswa);
router.delete('/mahasiswas/:id',verifyUser, deleteMahasiswa);

export default router;