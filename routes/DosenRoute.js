import express from "express";
import {
    getDosen,
    getProdiDosen,
    getDosenById,
    getDosenByNama,
    getDosenByNamo,
    createDosen,
    updateDosen,
    deleteDosen
} from "../controllers/Dosen.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/dosens',verifyUser, getDosen);
router.get('/dosens/prodi',verifyUser, getProdiDosen);
router.get('/dosens/:id',verifyUser, getDosenById);
router.get('/dosenn/:nama',verifyUser, getDosenByNama);
router.get('/dosenn/',verifyUser, getDosenByNamo);
router.post('/dosens',verifyUser, createDosen);
router.patch('/dosens/:id',verifyUser, updateDosen);
router.delete('/dosens/:id',verifyUser, deleteDosen);

export default router;