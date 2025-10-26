import express from "express";
import {
    getNilai,
    getAllNilaiByPeriode,
    getNilaiById,
    getNilaiByKgt,
    createNilai,
    bulkCreateNilai,
    updateNilai,
    deleteNilai
} from "../controllers/Nilai.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/nilais/:kgt/:field/:smnr',verifyUser, getNilai);
router.get('/nilaip/:kgt/:prd',verifyUser, getAllNilaiByPeriode);
router.get('/nilais/:kgt/:id',verifyUser, getNilaiByKgt);
router.get('/nilais/:id',verifyUser, getNilaiById);
router.post('/nilais',verifyUser, createNilai);
router.post('/nilaib',verifyUser, bulkCreateNilai);
router.patch('/nilais/:id',verifyUser, updateNilai);
router.delete('/nilais/:id',verifyUser, deleteNilai);

export default router;