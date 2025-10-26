import express from "express";
import {
    getFormulir,
    getFormulirById,
    createFormulir,
    updateFormulir,
    deleteFormulir
} from "../controllers/Formulir.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/formulirs',verifyUser, getFormulir);
router.get('/formulirs/:id',verifyUser, getFormulirById);
router.post('/formulirs',verifyUser, createFormulir);
router.patch('/formulirs/:id',verifyUser, updateFormulir);
router.delete('/formulirs/:id',verifyUser, deleteFormulir);

export default router;