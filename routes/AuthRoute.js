import express from "express";
import {Login, logOut, Me, changePassword} from "../controllers/Auth.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.delete('/logout', logOut);
router.patch('/userc/:id', verifyUser, changePassword);

export default router;