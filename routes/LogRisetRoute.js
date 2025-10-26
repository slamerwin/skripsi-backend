import express from "express";
import {
    getLog,
    getLogByProposal,
    createLog
} from "../controllers/LogRiset.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/logrisets',verifyUser, getLog);
router.get('/logrisets/:id',verifyUser, getLogByProposal);
router.post('/logrisets',verifyUser, createLog);

export default router;