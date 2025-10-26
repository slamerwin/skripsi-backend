import Sidang from "../models/SidangModel.js";
import Dosen from "../models/DosenModel.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Proposal from "../models/ProposalModel.js";
import Periode from "../models/PeriodeModel.js";
import db from "../config/Database.js";
import {Op,Sequelize,QueryTypes} from "sequelize";
//id_proposal,id_periode,waktu,ruang,nomor_bap,ketua_penguji,penguji_satu,penguji_dua,penguji_tiga,penguji_empat
export const getSidang = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa',{
                    type: QueryTypes.SELECT   
            });
        }else if(req.role === "Dosen"){
            const dosen = await Dosen.findOne({
                where:{
                    uuid: req.params.iddosen
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE sidang.ketua_penguji=:idd OR sidang.penguji_satu=:idd OR sidang.penguji_dua=:idd OR sidang.penguji_tiga=:idd OR sidang.penguji_empat=:idd',{
                    replacements: { idd: dosen.id },
                    type: QueryTypes.SELECT
            });
        }else if(req.role === "Mahasiswa"){
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    uuid: req.params.idmahasiswa
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id_mahasiswa=:idd',{
                    replacements: { idd: mahasiswa.id },
                    type: QueryTypes.SELECT
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSidangByProp = async(req, res) =>{
    try {
        const prop = await Proposal.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!prop) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
        let response;
        if(req.role === "kaprodi"){
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.ketua_penguji) as id_ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_satu) as id_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_dua) as id_penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_tiga) as id_penguji_tiga, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_empat) as id_penguji_empat '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE sidang.id_proposal=:idd AND kaprodi.id_user=:prodi',{
                    replacements: { 
                        idd: prop.id,
                        prodi: req.userId
                    },
                    type: QueryTypes.SELECT,
                    plain: true
            });
            res.status(200).json(response);
        }else if(req.role === "staff"){
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.ketua_penguji) as id_ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_satu) as id_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_dua) as id_penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_tiga) as id_penguji_tiga, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_empat) as id_penguji_empat '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'WHERE sidang.id_proposal=:idd AND staff.id_user=:idu',{
                    replacements: { 
                        idd: prop.id,
                        idu: req.userId
                    },
                    type: QueryTypes.SELECT,
                    plain: true
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSidangByPeriode = async (req, res) =>{
    try {
        let response;
        if(req.role === "kaprodi"){
            const periode = await Periode.findOne({
                where:{
                    uuid: req.params.id
                }
            });
            if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.uuid as idproposal, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE kaprodi.id_user=:idd AND sidang.id_periode=:prd AND proposal.status=:stt',{
                    replacements: { 
                        idd: req.userId,
                        stt: req.params.stt,
                        prd: periode.id
                    },
                    type: QueryTypes.SELECT
            });
        }else if(req.role === "staff"){
            const periode = await Periode.findOne({
                where:{
                    uuid: req.params.id
                }
            });
            if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.uuid as idproposal, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi, '+
                '(SELECT prodi.uri FROM prodi WHERE prodi.id=proposal.id_prodi) as uri_prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'WHERE sidang.id_periode=:prd AND proposal.status=:stt AND staff.id_user=:idd',{
                    replacements: { 
                        idd: req.userId,
                        stt: req.params.stt,
                        prd: periode.id
                    },
                    type: QueryTypes.SELECT
            });
        }else if(req.role === "dosen"){
            const periode = await Periode.findOne({
                where:{
                    uuid: req.params.id
                }
            });
            if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, (CASE WHEN sidang.ketua_penguji='+dosen.id+' THEN "ketua_penguji" WHEN sidang.penguji_satu='+dosen.id+' THEN "penguji_satu" WHEN sidang.penguji_dua='+dosen.id+' THEN "penguji_dua" WHEN sidang.penguji_tiga='+dosen.id+' THEN "penguji_tiga" WHEN sidang.penguji_empat='+dosen.id+' THEN "penguji_empat" ELSE "TAK TAHU" END) as nama_field, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi, '+
                '(SELECT prodi.uri FROM prodi WHERE prodi.id=proposal.id_prodi) as uri_prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE proposal.status=:stt AND (sidang.ketua_penguji=:idd OR sidang.penguji_satu=:idd OR sidang.penguji_dua=:idd OR sidang.penguji_tiga=:idd OR proposal.pembimbing_satu=:idd OR proposal.pembimbing_dua=:idd) AND sidang.id_periode=:prd',{
                    replacements: { 
                        idd: dosen.id,
                        stt: req.params.stt,
                        prd: periode.id
                    },
                    type: QueryTypes.SELECT
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSidangByNguji = async (req, res) =>{
    try {
        let response;
        if(req.role === "dosen"){
            const periode = await Periode.findOne({
                where:{
                    uuid: req.params.id
                }
            });
            if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, (CASE WHEN sidang.ketua_penguji='+dosen.id+' THEN "ketua_penguji" WHEN sidang.penguji_satu='+dosen.id+' THEN "penguji_satu" WHEN sidang.penguji_dua='+dosen.id+' THEN "penguji_dua" WHEN sidang.penguji_tiga='+dosen.id+' THEN "penguji_tiga" WHEN sidang.penguji_empat='+dosen.id+' THEN "penguji_empat" ELSE "TAK TAHU" END) as nama_field, proposal.judul, proposal.link_drive, proposal.status, proposal.uuid as id_proposal, mahasiswa.uuid as id_mahasiswa, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi, '+
                '(SELECT prodi.uri FROM prodi WHERE prodi.id=proposal.id_prodi) as uri_prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE (sidang.ketua_penguji=:idd OR sidang.penguji_satu=:idd OR sidang.penguji_dua=:idd OR sidang.penguji_tiga=:idd OR sidang.penguji_empat=:idd OR proposal.pembimbing_satu=:idd OR proposal.pembimbing_dua=:idd) AND sidang.id_periode=:prd',{
                    replacements: { 
                        idd: dosen.id,
                        prd: periode.id
                    },
                    type: QueryTypes.SELECT
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSidangByMhs = async(req, res) =>{
    try{
        let response;
        if(req.role === "mahasiswa"){
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.uuid as idproposal, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id_mahasiswa=:mhs AND proposal.status=:stt',{
                    replacements: {
                        stt: req.params.stt,
                        mhs: mahasiswa.id
                    },
                    type: QueryTypes.SELECT
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSidangByBimbing = async (req, res) =>{
    try {
        let response;
        if(req.role === "dosen"){
            const periode = await Periode.findOne({
                where:{
                    uuid: req.params.id
                }
            });
            if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, (CASE WHEN proposal.pembimbing_satu='+dosen.id+' THEN "pembimbing_satu" WHEN proposal.pembimbing_dua='+dosen.id+' THEN "pembimbing_dua" ELSE "TAK TAHU" END) as nama_field, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE (proposal.pembimbing_satu=:idd OR proposal.pembimbing_dua=:idd) AND sidang.id_periode=:prd',{
                    replacements: { 
                        idd: dosen.id,
                        prd: periode.id
                    },
                    type: QueryTypes.SELECT
            });
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSidangById = async(req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, periode.uuid as periode, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.ketua_penguji) as id_ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_satu) as id_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE sidang.uuid=:ids',{
                    replacements: { ids:req.params.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }else if(req.role === "dosen"){
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, periode.uuid as periode, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.ketua_penguji) as nip_ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.penguji_satu) as nip_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.penguji_dua) as nip_penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.penguji_tiga) as nip_penguji_tiga,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.penguji_empat) as nip_penguji_empat, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE sidang.uuid=:ids AND (sidang.ketua_penguji=:idd OR sidang.penguji_satu=:idd OR sidang.penguji_dua=:idd OR sidang.penguji_tiga=:idd OR sidang.penguji_empat=:idd)',{
                    replacements: { idd: dosen.id, ids:req.params.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }else if(req.role === "Mahasiswa"){
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    uuid: req.params.idmahasiswa
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, periode.uuid as periode, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.ketua_penguji) as id_ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_satu) as id_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id_mahasiswa=:idd AND sidang.uuid=:ids',{
                    replacements: { idd: mahasiswa.id, ids:req.params.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }else if(req.role === "staff"){
            response = await db.query(
                'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, periode.jenis as jenis_semester, periode.tahun_ajaran, periode.uuid as periode, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.ketua_penguji) as nip_ketua_penguji,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.penguji_satu) as nip_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_satu) as penguji_satu,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.penguji_dua) as nip_penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_dua) as penguji_dua,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.penguji_tiga) as nip_penguji_tiga,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_tiga) as penguji_tiga,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=sidang.penguji_empat) as nip_penguji_empat, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.penguji_empat) as penguji_empat, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE sidang.uuid=:ids',{
                    replacements: { ids:req.params.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }
        if(!response) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createSidang = async(req, res) =>{
    const {idproposal, idsemester, waktu, ruang, nobap, ketua, satu, dua, tiga, empat} = req.body;
    try {
        const proposal = await Proposal.findOne({
            where:{
                uuid: idproposal
            }
        });
        if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
        const periode = await Periode.findOne({
            where:{
                uuid: idsemester
            }
        });
        if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
        const dsnketua = await Dosen.findOne({
            where:{
                uuid: ketua
            }
        });
        if(!dsnketua) return res.status(404).json({msg: "Data dosen ketua tidak ditemukan"});
        const dsnsatu = await Dosen.findOne({
            where:{
                uuid: satu
            }
        });
        if(!dsnsatu) return res.status(404).json({msg: "Data dosen penguji satu tidak ditemukan"});
        const dsndua = await Dosen.findOne({
            where:{
                uuid: dua
            }
        });
        if(!dsndua) return res.status(404).json({msg: "Data dosen penguji kedua tidak ditemukan"});
        const dsntiga = await Dosen.findOne({
            where:{
                uuid: tiga
            }
        });
        if(!dsntiga) return res.status(404).json({msg: "Data dosen penguji ketiga tidak ditemukan"});
        const dsnempat = await Dosen.findOne({
            where:{
                uuid: empat
            }
        });
        if(!dsnempat) return res.status(404).json({msg: "Data dosen penguji keempat tidak ditemukan"});
        await Sidang.create({
            id_proposal: proposal.id,
            id_periode: periode.id,
            waktu: waktu,
            ruang: ruang,
            nomor_bap: nobap,
            ketua_penguji: dsnketua.id,
            penguji_satu: dsnsatu.id,
            penguji_dua: dsndua.id,
            penguji_tiga: dsntiga.id,
            penguji_empat: dsnempat.id
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateSidang = async(req, res) =>{
    const sidang = await Sidang.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!sidang) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
    const {idsemester, waktu, ruang, nobap, ketua, satu, dua, tiga, empat} = req.body;
    try {
        const periode = await Periode.findOne({
            where:{
                uuid: idsemester
            }
        });
        if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
        const dsnketua = await Dosen.findOne({
            where:{
                uuid: ketua
            }
        });
        if(!dsnketua) return res.status(404).json({msg: "Data dosen ketua tidak ditemukan"});
        const dsnsatu = await Dosen.findOne({
            where:{
                uuid: satu
            }
        });
        if(!dsnsatu) return res.status(404).json({msg: "Data dosen penguji satu tidak ditemukan"});
        const dsndua = await Dosen.findOne({
            where:{
                uuid: dua
            }
        });
        if(!dsndua) return res.status(404).json({msg: "Data dosen penguji kedua tidak ditemukan"});
        const dsntiga = await Dosen.findOne({
            where:{
                uuid: tiga
            }
        });
        if(!dsntiga) return res.status(404).json({msg: "Data dosen penguji ketiga tidak ditemukan"});
        const dsnempat = await Dosen.findOne({
            where:{
                uuid: empat
            }
        });
        if(!dsnempat) return res.status(404).json({msg: "Data dosen penguji keempat tidak ditemukan"});
        await Sidang.update({
            id_proposal: proposal.id,
            id_periode: periode.id,
            waktu: waktu,
            ruang: ruang,
            nomor_bap: nobap,
            ketua_penguji: dsnketua.id,
            penguji_satu: dsnsatu.id,
            penguji_dua: dsndua.id,
            penguji_tiga: dsntiga.id,
            penguji_empat: dsnempat.id
        },{
            where:{
                id: sidang.id
            }
        });
        res.status(200).json({msg: "Sidang Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateSimpanJadwal = async(req, res) =>{
    try {
        const {idsidang, idproposal, idperiode, waktu, ruang, nobap, ketuapenguji, pengujisatu, pengujidua, pengujitiga, pengujiempat} = req.body;
        const proposal = await Proposal.findOne({
            where:{
                uuid: idproposal
            }
        });
        if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
        const periode = await Periode.findOne({
            where:{
                uuid: idperiode
            }
        });
        if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
        const ketua = await Dosen.findOne({
            where:{
                uuid: ketuapenguji
            }
        });
        if(!ketua) return res.status(404).json({msg: "Data ketua penguji tidak ditemukan"});
        const dosen1 = await Dosen.findOne({
            where:{
                uuid: pengujisatu
            }
        });
        if(!dosen1) return res.status(404).json({msg: "Data penguji satu satu tidak ditemukan"});
        const dosen2 = await Dosen.findOne({
            where:{
                uuid: pengujidua
            }
        });
        if(!dosen2) return res.status(404).json({msg: "Data penguji dua tidak ditemukan"});
        const dosen3 = await Dosen.findOne({
            where:{
                uuid: pengujitiga
            }
        });
        if(!dosen3) return res.status(404).json({msg: "Data penguji tiga tidak ditemukan"});
        const dosen4 = await Dosen.findOne({
            where:{
                uuid: pengujiempat
            }
        });
        if(!dosen4) return res.status(404).json({msg: "Data penguji empat tidak ditemukan"});
        const jadwal = await Sidang.findOne({
            where:{
                uuid: idsidang
            }
        });
        if(!jadwal){
            await Sidang.create({
                id_proposal: proposal.id,
                id_periode: periode.id,
                waktu: waktu,
                ruang: ruang,
                nomor_bap: nobap,
                ketua_penguji: ketua.id,
                penguji_satu: dosen1.id,
                penguji_dua: dosen2.id,
                penguji_tiga: dosen3.id,
                penguji_empat: dosen4.id
            });
        }else{
            await Sidang.update({
                id_periode:periode.id, waktu, ruang, nomor_bap:nobap, ketua_penguji:ketua.id, penguji_satu:dosen1.id, penguji_dua:dosen2.id, penguji_tiga:dosen3.id, penguji_empat:dosen4.id},{
                where:{
                    id: jadwal.id
                }
            });
        }
        await Proposal.update({
            status: 'Terjadwal_Sidang'
        },{
            where:{
                id: proposal.id
            }
        });
        res.status(200).json({msg: "Jadwal updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const tandaiLulus = async(req, res) =>{
    try {
        if(req.role === "kaprodi"){
            const proposal = await Proposal.findOne({
                where:{
                    uuid: req.params.id
                }
            });
            if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
            await Proposal.update({
                status: 'Lulus_Sidang'
            },{
                where:{
                    id: proposal.id
                }
            });
            res.status(200).json({msg: "Proposal updated successfuly"});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const tandaiGagal = async(req, res) =>{
    try {
        if(req.role === "kaprodi"){
            const proposal = await Proposal.findOne({
                where:{
                    uuid: req.params.id
                }
            });
            if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
            await Proposal.update({
                status: 'Gagal_Sidang'
            },{
                where:{
                    id: proposal.id
                }
            });
            res.status(200).json({msg: "Proposal updated successfuly"});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const ajukanSidang = async(req, res) =>{
    try {
        const proposal = await Proposal.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
        await Proposal.update({
            status: 'Verifikasi_Sidang'
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

export const deleteSidang = async(req, res) =>{
    const sidang = await Sidang.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!sidang) return res.status(404).json({msg: "Sidang tidak ditemukan"});
    try {
        await Sidang.destroy({
            where:{
                id: sidang.id
            }
        });
        res.status(200).json({msg: "Sidang Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}