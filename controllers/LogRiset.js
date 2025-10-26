import Periode from "../models/PeriodeModel.js";
import db from "../config/Database.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Dosen from "../models/DosenModel.js";
import Proposal from "../models/ProposalModel.js";
import LogRiset from "../models/LogRisetModel.js";
import {Op,Sequelize,QueryTypes} from "sequelize";


export const getLog = async (req, res) =>{
    try {
        let log;
        let mahasiswa;
        if(req.role === "mahasiswa"){
            const mhs = await Mahasiswa.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!mhs) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
            mahasiswa = await Mahasiswa.findOne({
                attributes:['uuid'],
                where:{
                    id: mhs.id
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
            log = await db.query(
                    'SELECT logriset.uuid, logriset.keterangan, logriset.label, logriset.createdAt as waktu, dosen.uuid as id_dosen '+
                    'FROM logriset '+
                    'LEFT JOIN dosen ON dosen.id=logriset.id_dosen '+
                    'WHERE logriset.id_mahasiswa=:idmhs',{
                        type: QueryTypes.SELECT,
                        replacements:{
                            idmhs: mhs.id
                        }
                    }
                );
        }
        res.status(200).json({mahasiswa,log});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getLogByProposal = async (req, res) =>{
    try {
        let log;
        let mahasiswa;
            const prop = await Proposal.findOne({
                where:{
                    uuid: req.params.id
                }
            });
            if(!prop) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
	    if(req.role==="dosen"){
		const dsn = await Dosen.findOne({
                	where:{
                    		id_user: req.userId
                	}
            	});
		if(!dsn) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
		mahasiswa = await db.query(
			'SELECT mahasiswa.uuid, mahasiswa.nama, mahasiswa.nim, proposal.judul, (CASE WHEN proposal.pembimbing_satu='+dsn.id+' THEN "Pembimbing I" WHEN proposal.pembimbing_dua='+dsn.id+' THEN "Pembimbing II" ELSE "TAK TAHU" END) as selaku '+
			'FROM proposal '+
			'LEFT JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
			'WHERE proposal.id=:idprop',{
				type: QueryTypes.SELECT,
				plain: true,
				replacements:{
					idprop: prop.id
				}
			}
		);
	    }else{
            	mahasiswa = await Mahasiswa.findOne({
                	attributes:['uuid','nama','nim'],
                	where:{
                    		id: prop.id_mahasiswa
                	}
            	});
	    }
            if(!mahasiswa) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
            log = await db.query(
                    'SELECT logriset.uuid, logriset.keterangan, logriset.label, logriset.createdAt as waktu, dosen.uuid as id_dosen '+
                    'FROM logriset '+
                    'LEFT JOIN dosen ON dosen.id=logriset.id_dosen '+
                    'WHERE logriset.id_proposal=:idprop',{
                        type: QueryTypes.SELECT,
                        replacements:{
                            idprop: prop.id
                        }
                    }
                );
        res.status(200).json({mahasiswa,log});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createLog = async(req, res) =>{
    try {
        if(req.role === "mahasiswa"){
            const {keterangan, idproposal, label} = req.body;
            const prop = await Proposal.findOne({
                where:{
                    uuid: idproposal
                }
            });
            if(!prop) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
            await LogRiset.create({
                keterangan: keterangan,
                label: label,
                id_proposal: prop.id,
                id_dosen: 0
            });
            res.status(201).json({msg: "Log Riset Created Successfuly"});
        }else if(req.role === "dosen"){
            const {keterangan, pembimbing, idproposal} = req.body;
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            const prop = await Proposal.findOne({
                where:{
                    uuid: idproposal
                }
            });
            if(!prop) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
            await LogRiset.create({
                keterangan: keterangan,
                label: "Arahan "+pembimbing,
                id_proposal: prop.id,
                id_dosen: dosen.id
            });
            res.status(201).json({msg: "Arahan Created Successfuly"});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getLogById = async (req, res) =>{
    try {
    	let bimbing;
        if(req.role === "admin"){
            
        }else if(req.role === "dosen"){
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            bimbing = await db.query(
            	'SELECT mahasiswa.nim, mahasiswa.nama, bimbing.rencana, bimbing.arahan, proposal.judul '+
            	'FROM bimbing '+
            	'CROSS JOIN proposal ON proposal.id=bimbing.id_proposal '+
            	'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
            	'WHERE bimbing.uuid=:iid',{
            	type: QueryTypes.SELECT,
            	plain: true,
            	replacements:{
            		iid:req.params.id
            	}
            });
        }else if(req.role === "mahasiswa"){
            bimbing = await Bimbing.findOne({
            	attributes:['rencana'],
            	where:{
            		uuid: req.params.id
            	},
            	include:[{
            		model: Dosen,
            		attributes: ['uuid']
            	}]
            });
        }
        res.status(200).json(bimbing);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getPembimbing = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            
        }else if(req.role === "dosen"){
            
        }else if(req.role === "mahasiswa"){
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT dosen.uuid, dosen.nama, (CASE WHEN proposal.pembimbing_satu=dosen.id THEN "Pembimbing I" WHEN proposal.pembimbing_dua=dosen.id THEN "Pembimbing II" END) as status '+
                'FROM dosen '+
                'LEFT JOIN proposal ON dosen.id=proposal.pembimbing_satu OR dosen.id=proposal.pembimbing_dua '+
                'WHERE proposal.id_mahasiswa=:pembs AND (proposal.status="Draft" OR proposal.status="Verifikasi_Seminar" OR proposal.status="Terjadwal_Seminar" OR proposal.status="Seminar_Lulus")',{
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

export const updateLog = async(req, res) =>{
    const {rencana,idpembimbing} = req.body;
    try {
        const bimbing = await Bimbing.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!bimbing) return res.status(404).json({msg: "Data bimbingan tidak ditemukan"});
        const dosen1 = await Dosen.findOne({
            where:{
                uuid: idpembimbing
            }
        });
        if(!dosen1) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
        await Bimbing.update({
            rencana: rencana, 
            id_pembimbing: dosen1.id
        },{
        	where:{
        		id: bimbing.id
        	}
        });
        res.status(201).json({msg: "Permohonan Bimbingan updated Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateMemBimbing = async(req, res) =>{
    const {arahan} = req.body;
    try {
        const bimbing = await Bimbing.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!bimbing) return res.status(404).json({msg: "Data bimbingan tidak ditemukan"});
        await Bimbing.update({
            arahan: arahan, 
            terlaksana: 1
        },{
        	where:{
        		id: bimbing.id
        	}
        });
        res.status(201).json({msg: "Permohonan Bimbingan Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}