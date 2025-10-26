import express from "express";
import {
    getKaprodi,
    getProdi,
    getKaprodiById,
    createKaprodi,
    updateKaprodi,
    deleteKaprodi
} from "../controllers/Kaprodi.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/kaprodis',verifyUser, getKaprodi);
router.get('/kaprodis/prodi',verifyUser, getProdi);
router.get('/kaprodis/:id',verifyUser, getKaprodiById);
router.post('/kaprodis',verifyUser, createKaprodi);
router.patch('/kaprodis/:id',verifyUser, updateKaprodi);
router.delete('/kaprodis/:id',verifyUser, deleteKaprodi);

export default router;