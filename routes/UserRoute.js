import express from "express";
import {
    getUsers,
    getUserById,
    getUserByName,
    getUserByNamo,
    createUser,
    createMhs,
    updateUser,
    deleteUser
} from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.get('/usern/:nama', verifyUser, adminOnly, getUserByName);
router.get('/usern/', verifyUser, adminOnly, getUserByNamo);
router.post('/users', verifyUser, adminOnly, createUser);
router.post('/cmhs', createMhs);
router.patch('/users/:id', verifyUser, adminOnly, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

export default router;