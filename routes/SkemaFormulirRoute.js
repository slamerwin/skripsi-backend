import express from "express";
import {
    getSkemaFormulir,
    getSkemaFormulirById,
    createSkemaFormulir,
    updateSkemaFormulir,
    deleteSkemaFormulir
} from "../controllers/SkemaFormulir.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/skemal/:id',verifyUser, getSkemaFormulir);
router.get('/skemas/:id',verifyUser, getSkemaFormulirById);
router.post('/skemas',verifyUser, createSkemaFormulir);
router.patch('/skemas/:id',verifyUser, updateSkemaFormulir);
router.delete('/skemas/:id',verifyUser, deleteSkemaFormulir);

export default router;