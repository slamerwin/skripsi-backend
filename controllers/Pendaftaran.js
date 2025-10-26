import Pendaftaran from "../models/PendaftaranModel.js";
import Ceklis from "../models/CeklisModel.js";
import Proposal from "../models/ProposalModel.js";
import Prodi from "../models/ProdiModel.js";
import db from "../config/Database.js";
import {Op,QueryTypes} from "sequelize";

export const getPendaftaran = async(req, res) =>{
    try {
        let proposal;
        let pendaftaran;
        if(req.role === "kaprodi"){
            proposal = await db.query(
                'SELECT proposal.uuid, proposal.judul, proposal.status, proposal.setuju_pembimbing_satu, proposal.setuju_pembimbing_dua, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE proposal.status=:stat AND kaprodi.id_user=:usr',{
                    type: QueryTypes.SELECT,
                    replacements: { 
                        stat: req.params.stat,
                        usr: req.userId
                    }
            });
            if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
            pendaftaran = await db.query(
                'SELECT ceklis.uuid, proposal.uuid as idproposal, pendaftaran.uuid as idlengkap, ceklis.keterangan, pendaftaran.lengkap '+
                'FROM ceklis '+
                'CROSS JOIN proposal ON ceklis.id_prodi=proposal.id_prodi '+
                'LEFT JOIN pendaftaran ON pendaftaran.id_proposal=proposal.id AND pendaftaran.id_ceklis=ceklis.id '+
                'WHERE proposal.status=:stat AND ceklis.kegiatan=:kgt AND ceklis.aktif=1',{
                    type: QueryTypes.SELECT,
                    replacements: {
                        stat: req.params.stat,
                        kgt: req.params.kgt
                    }
                });
            if(!pendaftaran) return res.status(404).json({msg: "Data pendaftaran tidak ditemukan"});
        }
        res.status(200).json({proposal,pendaftaran});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getPendaftaranByProp = async(req, res) =>{
    try {
        let response;
        if(req.role === "staff"){
            response = await db.query(
                'SELECT ceklis.uuid, pendaftaran.uuid as idlengkap, ceklis.keterangan, pendaftaran.lengkap '+
                'FROM ceklis '+
                'CROSS JOIN proposal ON ceklis.id_prodi=proposal.id_prodi '+
                'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'LEFT JOIN pendaftaran ON pendaftaran.id_proposal=proposal.id AND pendaftaran.id_ceklis=ceklis.id '+
                'WHERE ceklis.kegiatan=:kgt AND proposal.uuid=:id AND staff.id_user=:idu AND ceklis.aktif=1',{
                    type: QueryTypes.SELECT,
                    replacements: {
                        kgt: req.params.kgt,
                        id: req.params.id,
                        idu: req.userId
                    }
                })
            if(!response) return res.status(404).json({msg: "Data kelengkapan tidak ditemukan"});
        }else if(req.role === "kaprodi"){
            response = await db.query(
                'SELECT ceklis.uuid, pendaftaran.uuid as idlengkap, ceklis.keterangan, pendaftaran.lengkap '+
                'FROM ceklis '+
                'CROSS JOIN proposal ON ceklis.id_prodi=proposal.id_prodi '+
                'LEFT JOIN pendaftaran ON pendaftaran.id_proposal=proposal.id AND pendaftaran.id_ceklis=ceklis.id '+
                'WHERE ceklis.kegiatan=:kgt AND proposal.uuid=:id AND ceklis.aktif=1',{
                    type: QueryTypes.SELECT,
                    replacements: {
                        kgt: req.params.kgt,
                        id: req.params.id
                    }
                });
            if(!response) return res.status(404).json({msg: "Data kelengkapan tidak ditemukan"});
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getPendaftaranById = async(req, res) =>{
    try {
        const response = await Pendaftaran.findOne({
            attributes:['uuid','kegiatan','nama_field','keterangan'],
            where: {
                uuid: req.params.id
            },
            include:[
                {
                    model:Prodi,
                    attributes:['uuid']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createPendaftaran = async(req, res) =>{
    const {kegiatan, namafield, keterangan, idprodi} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        await Pendaftaran.create({
            kegiatan: kegiatan,
            nama_field: namafield,
            keterangan: keterangan,
            id_prodi: prodi.id
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updatePendaftaran = async(req, res) =>{
    const prop = await Proposal.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!prop) return res.status(404).json({msg: "Proposal tidak ditemukan"});
    let key;
    try {
        for(key in req.body.kelengkapan)
        {
            const ceklis = await Ceklis.findOne({
                where:{
                    uuid: req.body.kelengkapan[key].uuid
                }
            });
            if(!ceklis) return res.status(404).json({msg: "Kelengkapan tidak ditemukan"});
            let nillengkap;
            if(req.body.kelengkapan[key].lengkap === null) nillengkap=0; else nillengkap=req.body.kelengkapan[key].lengkap;
            if(req.body.kelengkapan[key].idlengkap!==null)
            {
                await Pendaftaran.update({
                    id_proposal: prop.id,
                    id_ceklis: ceklis.id,
                    lengkap: nillengkap
                },{
                    where:{
                        uuid : req.body.kelengkapan[key].idlengkap
                    }
                });
            }else if(req.body.kelengkapan[key].idlengkap===null)
            {
                await Pendaftaran.create({
                    id_proposal: prop.id,
                    id_ceklis: ceklis.id,
                    lengkap: nillengkap
                });
            }
        }
        res.status(200).json({msg: "Pendaftaran Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deletePendaftaran = async(req, res) =>{
    const form = await Pendaftaran.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!form) return res.status(404).json({msg: "Pendaftaran tidak ditemukan"});
    try {
        await Pendaftaran.destroy({
            where:{
                id: form.id
            }
        });
        res.status(200).json({msg: "Pendaftaran Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}