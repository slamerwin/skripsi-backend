import Dosen from "../models/DosenModel.js";
import Prodi from "../models/ProdiModel.js";
import Periode from "../models/PeriodeModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Proposal from "../models/ProposalModel.js";
import { Op, Sequelize, QueryTypes } from "sequelize";
import db from "../config/Database.js";

export const getProposal = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa',{
                    type: QueryTypes.SELECT   
            });
        }else if(req.role === "dosen"){
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, (CASE WHEN proposal.pembimbing_satu='+dosen.id+' AND proposal.setuju_pembimbing_satu=1 THEN "Ya" WHEN proposal.pembimbing_dua='+dosen.id+' AND proposal.setuju_pembimbing_dua=1 THEN "Ya" ELSE "Belum" END) as persetujuan, mahasiswa.uuid as id_mahasiswa, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE (proposal.pembimbing_satu=:pembs OR proposal.pembimbing_dua=:pembs) AND (proposal.status="Seminar_Lulus" OR proposal.status="Draft" OR proposal.status="Verifikasi_Seminar" OR proposal.status="Terjadwal_Seminar" OR proposal.status="Daftar_Sidang" OR proposal.status="Verifikasi_Sidang" OR proposal.status="Terjadwal_Sidang")',{
                    type: QueryTypes.SELECT,
                    replacements: { 
                        pembs:dosen.id
                    }   
            });
        }else if(req.role === "mahasiswa"){
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, proposal.setuju_pembimbing_satu, proposal.setuju_pembimbing_dua, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id_mahasiswa=:pembs',{
                    type: QueryTypes.SELECT,
                    replacements: { 
                        pembs:mahasiswa.id
                    }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProposalByStatus = async(req, res) =>{
    try{
        let response;
        if(req.role === "staff"){
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, proposal.setuju_pembimbing_satu, proposal.setuju_pembimbing_dua, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'WHERE proposal.status=:pembs AND staff.id_user=:idu',{
                    type: QueryTypes.SELECT,
                    replacements: { 
                        pembs: req.params.stat,
                        idu: req.userId
                    }
            });
        }else if(req.role === "kaprodi"){
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, proposal.setuju_pembimbing_satu, proposal.setuju_pembimbing_dua, mahasiswa.nim, mahasiswa.nama as mahasiswa, mahasiswa.uuid as id_mahasiswa, mahasiswa.nomor_handphone as handphone, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE proposal.status=:pembs AND kaprodi.id_user=:usr',{
                    type: QueryTypes.SELECT,
                    replacements: { 
                        pembs: req.params.stat,
                        usr: req.userId
                    }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProposalById = async(req, res) =>{
    try {
        const proposal = await Proposal.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!proposal) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, proposal.setuju_pembimbing_satu, proposal.tgl_setuju_pemb_satu, proposal.setuju_pembimbing_dua, proposal.tgl_setuju_pemb_dua, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as id_pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as id_pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id=:pembs',{
                    type: QueryTypes.SELECT,
                    plain: true,
                    replacements: { 
                        pembs:proposal.id
                    }   
            });
        }else if(req.role === "dosen"){
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id=:pembs AND (proposal.pembimbing_satu=:pembd OR proposal.pembimbing_dua=:pembd)',{
                    type: QueryTypes.SELECT,
                    plain: true,
                    replacements: { 
                        pembs: proposal.id,
                        pembd: dosen.id
                    }   
            });
        }else if(req.role === "mahasiswa"){
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.setuju_pembimbing_satu, proposal.setuju_pembimbing_dua, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as id_pembimbing_satu, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as id_pembimbing_dua, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi, '+
                '(SELECT prodi.uuid FROM prodi WHERE prodi.id=proposal.id_prodi) as idprodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id=:pembs AND proposal.id_mahasiswa=:pembd',{
                    type: QueryTypes.SELECT,
                    plain: true,
                    replacements: { 
                        pembs: proposal.id,
                        pembd: mahasiswa.id
                    }   
            });
        }else if(req.role === "staff"){
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, proposal.setuju_pembimbing_satu, proposal.tgl_setuju_pemb_satu, proposal.setuju_pembimbing_dua, proposal.tgl_setuju_pemb_dua, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.uuid FROM prodi WHERE prodi.id=proposal.id_prodi) as idprodi, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id=:pembs AND staff.id_user=:idu',{
                    type: QueryTypes.SELECT,
                    plain: true,
                    replacements: { 
                        pembs:proposal.id,
                        idu: req.userId
                    }   
            });
        }else if(req.role === "kaprodi"){
            response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, proposal.setuju_pembimbing_satu, proposal.tgl_setuju_pemb_satu, proposal.setuju_pembimbing_dua, proposal.tgl_setuju_pemb_dua, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as id_pembimbing_satu,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as id_pembimbing_dua,'+
                '(SELECT prodi.uuid FROM prodi WHERE prodi.id=proposal.id_prodi) as idprodi, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id=:pembs',{
                    type: QueryTypes.SELECT,
                    plain: true,
                    replacements: { 
                        pembs:proposal.id
                    }   
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProposalByMhs = async(req, res) =>{
    try {     
        const response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, proposal.setuju_pembimbing_satu, proposal.tgl_setuju_pemb_satu, proposal.setuju_pembimbing_dua, proposal.tgl_setuju_pemb_dua, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as nama_pembimbing_satu,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as nama_pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id_mahasiswa IN (SELECT mahasiswa.id FROM mahasiswa WHERE mahasiswa.nama LIKE "%'+req.params.nama+'%")',{
                    type: QueryTypes.SELECT
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProposalByMho = async(req, res) =>{
    try {
        const response = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.link_drive, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, proposal.setuju_pembimbing_satu, proposal.tgl_setuju_pemb_satu, proposal.setuju_pembimbing_dua, proposal.tgl_setuju_pemb_dua, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as nama_pembimbing_satu,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as nama_pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id_mahasiswa IN (SELECT mahasiswa.id FROM mahasiswa WHERE mahasiswa.nama LIKE "00%")',{
                    type: QueryTypes.SELECT
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createProposal = async(req, res) =>{
    const {judul, idmhs, linkdrive, pembsatu, pembdua, idprodi, status} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        const mahasiswa = await Mahasiswa.findOne({
            where:{
                uuid: idmhs
            }
        });
        if(!mahasiswa) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
        const dosen1 = await Dosen.findOne({
            where:{
                uuid: pembsatu
            }
        });
        if(!dosen1) return res.status(404).json({msg: "Data pembimbing satu tidak ditemukan"});
        const dosen2 = await Dosen.findOne({
            where:{
                uuid: pembdua
            }
        });
        if(!dosen2) return res.status(404).json({msg: "Data pembimbing dua tidak ditemukan"});
        await Proposal.create({
            judul: judul,
            link_drive: linkdrive,
            id_mahasiswa: mahasiswa.id,
            pembimbing_satu: dosen1.id,
            pembimbing_dua: dosen2.id,
            id_prodi: prodi.id,
            status: status
        });
        res.status(201).json({msg: "Proposal Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateProposal = async(req, res) =>{
    try {
        const proposal = await Proposal.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
        const {judul, linkdrive, pembsatu, setujupembsatu, pembdua, setujupembdua, status} = req.body;
        const dosen1 = await Dosen.findOne({
            where:{
                uuid: pembsatu
            }
        });
        if(!dosen1) return res.status(404).json({msg: "Data pembimbing satu tidak ditemukan"});
        const dosen2 = await Dosen.findOne({
            where:{
                uuid: pembdua
            }
        });
        if(!dosen2) return res.status(404).json({msg: "Data pembimbing dua tidak ditemukan"});
        if(req.role === "admin"){
            await Proposal.update({judul, pembimbing_satu:dosen1.id, setuju_pembimbing_satu:setujupembsatu, pembimbing_dua:dosen2.id, setuju_pembimbing_dua:setujupembdua, status},{
                where:{
                    id: proposal.id
                }
            });
        }else if(req.role === "mahasiswa"){
            const {judul, pembsatu, pembdua, idprodi} = req.body;
            const prodi = await Prodi.findOne({
                where:{
                    uuid: idprodi
                }
            });
            if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(proposal.id_mahasiswa !== mahasiswa.id) return res.status(403).json({msg: "Akses terlarang"});
            await Proposal.update({judul, link_drive: linkdrive, pembimbing_satu:dosen1.id, pembimbing_dua:dosen2.id, id_prodi:prodi.id},{
                where:{
                    id: proposal.id
                }
            });
        }
        res.status(200).json({msg: "Proposal updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const ajukanProposal = async(req, res) =>{
    try {
        const proposal = await Proposal.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
        await Proposal.update({
            status: 'Verifikasi_Seminar'
        },{
            where:{
                id: proposal.id
            }
        });
        res.status(200).json({msg: "Proposal updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const setSetujuPembimbing = async(req, res) =>{
    try {
        if(req.role === "dosen")
        {
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            const proposal = await db.query(
                'SELECT proposal.id, (CASE WHEN proposal.pembimbing_satu='+dosen.id+' THEN "satu" WHEN proposal.pembimbing_dua='+dosen.id+' THEN "dua" ELSE "Belum" END) as jenis_pembimbing '+
                'FROM proposal '+
                'WHERE proposal.uuid=:idd',{
                    type: QueryTypes.SELECT,
                    plain: true,
                    replacements:{
                        idd: req.params.id
                    }
                });
            if(proposal.jenis_pembimbing === "satu")
            {
                await Proposal.update({
                    setuju_pembimbing_satu: 1,
                    tgl_setuju_pemb_satu: new Date()
                },{
                    where:{
                        id: proposal.id
                    }
                });
            }else if(proposal.jenis_pembimbing === "dua"){
                await Proposal.update({
                    setuju_pembimbing_dua: 1,
                    tgl_setuju_pemb_dua: new Date()
                },{
                    where:{
                        id: proposal.id
                    }
                });
            }
        }
        res.status(200).json({msg: "Pembimbing berhasil menyetujui"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteProposal = async(req, res) =>{
    try {
        const proposal = await Proposal.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!proposal) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "admin"){
            await Proposal.destroy({
                where:{
                    id: proposal.id
                }
            });
        }else if(req.role === "mahasiswa"){
		const mhs = await Mahasiswa.findOne({
			where:{
				id_user: req.userId
			}
		});
		if(!mhs) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
		if(mhs.id===proposal.id_mahasiswa)
		{
	            await Proposal.destroy({
        	        where:{
                	    id: proposal.id
                	}
		    });
		}
        }
        res.status(200).json({msg: "Proposal deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const setTolakPembimbing = async(req, res) =>{
    try {
        if(req.role === "dosen")
        {
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            const proposal = await db.query(
                'SELECT proposal.id, (CASE WHEN proposal.pembimbing_satu='+dosen.id+' THEN "satu" WHEN proposal.pembimbing_dua='+dosen.id+' THEN "dua" ELSE "Belum" END) as jenis_pembimbing '+
                'FROM proposal '+
                'WHERE proposal.uuid=:idd',{
                    type: QueryTypes.SELECT,
                    plain: true,
                    replacements:{
                        idd: req.params.id
                    }
                });
            if(proposal.jenis_pembimbing === "satu")
            {
                await Proposal.update({
                    pembimbing_satu: 0
                },{
                    where:{
                        id: proposal.id
                    }
                });
            }else if(proposal.jenis_pembimbing === "dua"){
                await Proposal.update({
                    pembimbing_dua: 0
                },{
                    where:{
                        id: proposal.id
                    }
                });
            }
        }
        res.status(200).json({msg: "Pembimbing berhasil menolak"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}