import express from "express";
import {
    getSidang,
    getSidangById,
    getSidangByPeriode,
    getSidangByNguji,
    getSidangByBimbing,
    getSidangByMhs,
    getSidangByProp,
    createSidang,
    updateSidang,
    tandaiLulus,
    tandaiGagal,
    updateSimpanJadwal,
    ajukanSidang,
    deleteSidang
} from "../controllers/Sidang.js";
import { verifyUser } from "../middleware/AuthUser.js";
 
const router = express.Router();

router.get('/sidangs',verifyUser, getSidang);
router.get('/sidangs/:id',verifyUser, getSidangById);
router.get('/sidange/:stt/:id',verifyUser, getSidangByPeriode);
router.get('/sidangb/:id',verifyUser, getSidangByBimbing);
router.get('/sidangn/:id',verifyUser, getSidangByNguji);
router.get('/sidangm/:stt',verifyUser, getSidangByMhs);
router.get('/sidangp/:id',verifyUser, getSidangByProp);
router.post('/sidangs',verifyUser, createSidang);
router.post('/sidangd',verifyUser, updateSimpanJadwal);
router.patch('/sidangs/:id',verifyUser, updateSidang);
router.patch('/sidangl/:id',verifyUser, tandaiLulus);
router.patch('/sidangg/:id',verifyUser, tandaiGagal);
router.patch('/sidanga/:id',verifyUser, ajukanSidang);
router.delete('/sidangs/:id',verifyUser, deleteSidang);

export default router;