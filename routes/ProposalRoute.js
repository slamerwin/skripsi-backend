import express from "express";
import {
    getProposal,
    getProposalById,
    getProposalByStatus,
    getProposalByMhs,
    getProposalByMho,
    setSetujuPembimbing,
    createProposal,
    updateProposal,
    ajukanProposal,
    deleteProposal,
    setTolakPembimbing
} from "../controllers/Proposal.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/proposals',verifyUser, getProposal);
router.get('/proposals/:id',verifyUser, getProposalById);
router.get('/proposalst/:stat',verifyUser, getProposalByStatus);
router.get('/proposaln/:nama',verifyUser, getProposalByMhs);
router.get('/proposaln/',verifyUser, getProposalByMho);
router.get('/proposalps/:id',verifyUser, setSetujuPembimbing);
router.post('/proposals',verifyUser, createProposal);
router.patch('/proposals/:id',verifyUser, updateProposal);
router.patch('/proposala/:id',verifyUser, ajukanProposal);
router.delete('/proposals/:id',verifyUser, deleteProposal);
router.delete('/proposalpt/:id',verifyUser, setTolakPembimbing);

export default router;