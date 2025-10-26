import express from "express";
import {
    getFormulirBap,
    getFormulirByIdKgt,
    getFormulirByIdNilai,
    getCatatanBap,
    getBap,
    getBapById,
    createBap,
    updateBap,
    deleteBap
} from "../controllers/Bap.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/baps',verifyUser, getFormulirBap);
router.get('/baps/:kgt/:id',verifyUser, getFormulirByIdKgt);
router.get('/baps/:kgt/:field/:id',verifyUser, getFormulirByIdNilai);
router.get('/bapc/:kgt/:id',verifyUser, getCatatanBap);
router.get('/lbaps',verifyUser, getBap);
router.get('/lbaps/:id',verifyUser, getBapById);
router.post('/lbaps',verifyUser, createBap);
router.patch('/lbaps/:id',verifyUser, updateBap);
router.delete('/lbaps/:id',verifyUser, deleteBap);

export default router;