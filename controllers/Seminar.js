import Periode from "../models/PeriodeModel.js";
import db from "../config/Database.js";
import Mahasiswa from "../models/MahasiswaModel.js";
import Dosen from "../models/DosenModel.js";
import Proposal from "../models/ProposalModel.js";
import JaSeMo from "../models/SeminarModel.js";
import {Op,Sequelize,QueryTypes} from "sequelize";

export const getJadwal = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa',{
                    type: QueryTypes.SELECT   
            });
        }else if(req.role === "dosen"){
            const dosen = await Dosen.findOne({
                where:{
                    uuid: req.params.iddosen
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE seminar.penguji_satu=:idd OR seminar.penguji_dua=:idd OR seminar.penguji_tiga=:idd OR proposal.pembimbing_satu=:idd OR proposal.pembimbing_dua=:idd',{
                    replacements: { idd: dosen.id },
                    type: QueryTypes.SELECT
            });
        }else if(req.role === "mahasiswa"){
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    uuid: req.params.idmahasiswa
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE proposal.id_mahasiswa=:idd',{
                    replacements: { idd: mahasiswa.id },
                    type: QueryTypes.SELECT
            });
        }else if(req.role === "kaprodi"){
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE kaprodi.id_user=:idd',{
                    replacements: { idd: req.userId },
                    type: QueryTypes.SELECT
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getJadwalByPeriode = async (req, res) =>{
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
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.uuid as idproposal, proposal.judul, proposal.status, proposal.link_drive, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE kaprodi.id_user=:idd AND seminar.id_periode=:prd',{
                    replacements: { 
                        idd: req.userId,
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
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, (CASE WHEN seminar.penguji_satu='+dosen.id+' THEN "penguji_satu" WHEN seminar.penguji_dua='+dosen.id+' THEN "penguji_dua" WHEN seminar.penguji_tiga='+dosen.id+' THEN "penguji_tiga" ELSE "TAK TAHU" END) as nama_field, proposal.judul, proposal.status, proposal.link_drive, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi, '+
                '(SELECT prodi.uri FROM prodi WHERE prodi.id=proposal.id_prodi) as uri_prodi '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE (seminar.penguji_satu=:idd OR seminar.penguji_dua=:idd OR seminar.penguji_tiga=:idd OR proposal.pembimbing_satu=:idd OR proposal.pembimbing_dua=:idd) AND seminar.id_periode=:prd',{
                    replacements: { 
                        idd: dosen.id,
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
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.uuid as idproposal, proposal.judul, proposal.status, proposal.link_drive, mahasiswa.nim, mahasiswa.nama as mahasiswa, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT prodi.nama FROM prodi WHERE prodi.id=proposal.id_prodi) as prodi, '+
                '(SELECT prodi.uri FROM prodi WHERE prodi.id=proposal.id_prodi) as uri_prodi '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'WHERE seminar.id_periode=:prd AND staff.id_user=:idu',{
                    replacements: {
                        prd: periode.id,
                        idu: req.userId
                    },
                    type: QueryTypes.SELECT
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getJadwalByMhs = async(req, res) =>{
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
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.uuid as idproposal, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
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

export const getJadwalByProp = async(req, res) =>{
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
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'WHERE seminar.id_proposal=:idd AND kaprodi.id_user=:prodi',{
                    replacements: { 
                        idd: prop.id,
                        prodi: req.userId
                    },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }else if(req.role === "staff"){
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=seminar.penguji_satu) as id_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=seminar.penguji_dua) as id_penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=seminar.penguji_tiga) as id_penguji_tiga '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'WHERE seminar.id_proposal=:idd AND staff.id_user=:idu',{
                    replacements: { 
                        idd: prop.id,
                        idu: req.userId
                    },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getJadwalById = async(req, res) =>{
    try {
        const jadwal = await JaSeMo.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!jadwal) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, seminar.ttd_penguji_satu, seminar.ttd_penguji_dua, seminar.ttd_penguji_tiga, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'WHERE seminar.id=:idd',{
                    replacements: { idd: jadwal.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }else if(req.role === "staff"){
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, seminar.ttd_penguji_satu, seminar.ttd_penguji_dua, seminar.ttd_penguji_tiga, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, periode.tahun_ajaran, periode.jenis as jenis_semester, prodi.nama as prodi, prodi.uuid as idprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu, '+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as nip_pembimbing_satu, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua, '+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as nip_pembimbing_dua, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=seminar.penguji_satu) as nip_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=seminar.penguji_dua) as nip_penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=seminar.penguji_tiga) as nip_penguji_tiga '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'WHERE seminar.id=:idd',{
                    replacements: { idd: jadwal.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }else if(req.role ==="dosen"){
            const dosen = await Dosen.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, seminar.ttd_penguji_satu, seminar.ttd_penguji_dua, seminar.ttd_penguji_tiga, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu, '+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as nip_pembimbing_satu, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua, '+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as nip_pembimbing_dua, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=seminar.penguji_satu) as nip_penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=seminar.penguji_dua) as nip_penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                '(SELECT (CASE WHEN dosen.guna_nidn=0 THEN dosen.nip ELSE dosen.nidn END) as nip FROM dosen WHERE dosen.id=seminar.penguji_tiga) as nip_penguji_tiga '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'WHERE seminar.id=:ids AND (seminar.penguji_satu=:idd OR seminar.penguji_dua=:idd OR seminar.penguji_tiga=:idd OR proposal.pembimbing_satu=:idd OR proposal.pembimbing_dua=:idd)',{
                    replacements: { ids: jadwal.id, idd: dosen.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }else if(req.role ==="mahasiswa"){
            const mahasiswa = await Mahasiswa.findOne({
                where:{
                    uuid: req.params.idmahasiswa
                }
            });
            if(!mahasiswa) return res.status(404).json({msg: "Data tidak ditemukan"});
            response = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as penguji_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_dua) as penguji_dua,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_tiga) as penguji_tiga, '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'WHERE seminar.id=:ids AND proposal.id_mahasiswa=:idd)',{
                    replacements: { ids: jadwal.id, idd: mahasiswa.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createJadwal = async(req, res) =>{
    const {idproposal, idperiode, waktu, ruang, nobap, pengujisatu, pengujidua, pengujitiga} = req.body;
    try {
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
        await JaSeMo.create({
            id_proposal: proposal.id,
            id_periode: periode.id,
            waktu: waktu,
            ruang: ruang,
            nomor_bap: nobap,
            penguji_satu: dosen1.id,
            penguji_dua: dosen2.id,
            penguji_tiga: dosen3.id
        });
        res.status(201).json({msg: "Jadwal Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const simpanTandaTangan = async(req, res) =>{
	try{
	    	const jadwal = await JaSeMo.findOne({
            		where:{
                		uuid: req.params.id
            		}
        	});
        	if(!jadwal) return res.status(404).json({msg: "Data jadwal tidak ditemukan"});
        	const {ttd} = req.body;
		if(req.params.penilai==="penguji_satu")
		{
			await JaSeMo.update({ttd_penguji_satu:ttd},{
                		where:{
                    			id: jadwal.id
                		}
            		});
			res.status(201).json({msg: "TTD 1 updated Successfuly"});
		}else if(req.params.penilai==="penguji_dua"){
			await JaSeMo.update({ttd_penguji_dua:ttd},{
                		where:{
                    			id: jadwal.id
                		}
            		});
			res.status(201).json({msg: "TTD 2 updated Successfuly"});
		}else if(req.params.penilai==="penguji_tiga"){
			await JaSeMo.update({ttd_penguji_tiga:ttd},{
                		where:{
                    			id: jadwal.id
                		}
            		});
			res.status(201).json({msg: "TTD 3 updated Successfuly"});
		}
	}catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateJadwal = async(req, res) =>{
    try {
        const jadwal = await JaSeMo.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!jadwal) return res.status(404).json({msg: "Data jadwal tidak ditemukan"});
        const {idperiode, waktu, ruang, nobap, pengujisatu, pengujidua, pengujitiga} = req.body;
        console.log(req.body);
        const periode = await Periode.findOne({
            where:{
                uuid: idperiode
            }
        });
        if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
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
        if(req.role === "admin"){
            await JaSeMo.update({id_periode:periode.id, waktu, ruang, nobap, penguji_satu:dosen1.id, penguji_dua:dosen2.id, penguji_tiga:dosen3.id},{
                where:{
                    id: jadwal.id
                }
            });
        }
        res.status(200).json({msg: "Jadwal updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateSimpanJadwal = async(req, res) =>{
    try {
        const {idseminar, idproposal, idperiode, waktu, ruang, nobap, pengujisatu, pengujidua, pengujitiga} = req.body;
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
        const jadwal = await JaSeMo.findOne({
            where:{
                uuid: idseminar
            }
        });
        if(!jadwal){
            await JaSeMo.create({
                id_proposal: proposal.id,
                id_periode: periode.id,
                waktu: waktu,
                ruang: ruang,
                nomor_bap: nobap,
                penguji_satu: dosen1.id,
                penguji_dua: dosen2.id,
                penguji_tiga: dosen3.id
            });
        }else{
            await JaSeMo.update({
                id_periode:periode.id, waktu, ruang, nomor_bap: nobap, penguji_satu:dosen1.id, penguji_dua:dosen2.id, penguji_tiga:dosen3.id},{
                where:{
                    id: jadwal.id
                }
            });
        }
        await Proposal.update({
            status: 'Terjadwal_Seminar'
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
                status: 'Lulus_Seminar'
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
                status: 'Gagal_Seminar'
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

export const deleteJadwal = async(req, res) =>{
    try {
        const jadwal = await JaSeMo.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!jadwal) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "admin"){
            await JaSeMo.destroy({
                where:{
                    id: jadwal.id
                }
            });
        }else{
            /*if(req.userId !== dosen.id_user) return res.status(403).json({msg: "Akses terlarang"});
            await Dosen.destroy({
                where:{
                    [Op.and]:[{id: dosen.id}, {id_user: req.userId}]
                }
            });*/
        }
        res.status(200).json({msg: "Jadwal deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}