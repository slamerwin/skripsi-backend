import express from "express";
import {
    getStaff,
    getProdi,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff
} from "../controllers/Staff.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/staffs',verifyUser, getStaff);
router.get('/staffs/prodi',verifyUser, getProdi);
router.get('/staffs/:id',verifyUser, getStaffById);
router.post('/staffs',verifyUser, createStaff);
router.patch('/staffs/:id',verifyUser, updateStaff);
router.delete('/staffs/:id',verifyUser, deleteStaff);

export default router;