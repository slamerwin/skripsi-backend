import express from "express";
import {
    getPeriode,
    getPeriodeById,
    createPeriode,
    updatePeriode,
    deletePeriode
} from "../controllers/Periode.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/periodes',verifyUser, getPeriode);
router.get('/periodes/:id',verifyUser, getPeriodeById);
router.post('/periodes',verifyUser, createPeriode);
router.patch('/periodes/:id',verifyUser, updatePeriode);
router.delete('/periodes/:id',verifyUser, deletePeriode);

export default router;