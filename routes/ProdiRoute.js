import express from "express";
import {
    getProdi,
    getProdiById,
    getProdiByUser,
    createProdi,
    updateProdi,
    deleteProdi
} from "../controllers/Prodi.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/prodis',verifyUser, getProdi);
router.get('/prodis/:id',verifyUser, getProdiById);
router.get('/prodiu',verifyUser, getProdiByUser);
router.post('/prodis',verifyUser, createProdi);
router.patch('/prodis/:id',verifyUser, updateProdi);
router.delete('/prodis/:id',verifyUser, deleteProdi);

export default router;