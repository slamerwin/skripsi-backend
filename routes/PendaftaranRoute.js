import express from "express";
import {
    getPendaftaran,
    getPendaftaranById,
    getPendaftaranByProp,
    createPendaftaran,
    updatePendaftaran,
    deletePendaftaran
} from "../controllers/Pendaftaran.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/pendaftarans/:kgt/:stat',verifyUser, getPendaftaran);
router.get('/pendaftarans/:id',verifyUser, getPendaftaranById);
router.get('/pendaftaranp/:kgt/:id',verifyUser, getPendaftaranByProp);
router.post('/pendaftarans',verifyUser, createPendaftaran);
router.patch('/pendaftarans/:id',verifyUser, updatePendaftaran);
router.delete('/pendaftarans/:id',verifyUser, deletePendaftaran);

export default router;