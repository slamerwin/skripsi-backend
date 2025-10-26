import express from "express";
import {
    getCeklis,
    getCeklisProdi,
    getCeklisProdiByProp,
    getCeklisById,
    createCeklis,
    updateCeklis,
    deleteCeklis
} from "../controllers/Ceklis.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/ceklis',verifyUser, getCeklis);
router.get('/ceklis/prodi',verifyUser, getCeklisProdi);
router.get('/ceklis/prodi/:kgt/:id',verifyUser, getCeklisProdiByProp);
router.get('/ceklis/:id',verifyUser, getCeklisById);
router.post('/ceklis',verifyUser, createCeklis);
router.patch('/ceklis/:id',verifyUser, updateCeklis);
router.delete('/ceklis/:id',verifyUser, deleteCeklis);

export default router;