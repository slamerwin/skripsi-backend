import db from "../config/Database.js";
import Prodi from "../models/ProdiModel.js";
import Dosen from "../models/DosenModel.js";
import Catatan from "../models/CatatanModel.js";
import Seminar from "../models/SeminarModel.js";
import Sidang from "../models/SidangModel.js";
import Bap from "../models/BapModel.js";
import {Op,Sequelize,QueryTypes} from "sequelize";

export const getBap = async (req, res) =>{
try {
        let response
        if(req.role === "admin")
        {
            response = await Bap.findAll({
                attributes:['uuid','kegiatan','nama_file','keterangan'],
                include:[
                    {
                        model:Prodi,
                        attributes:['nama','fakultas']
                    }
                ]
            });
        }else if(req.role === "kaprodi")
        {
            const kaprodi = await Kaprodi.findOne({
                where:{
                    id_user: req.userId
                }
            });
            if(!kaprodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
            response = await Bap.findAll({
                attributes:['uuid','kegiatan','nama_file','keterangan'],
                where: {
                    id_prodi: kaprodi.id_prodi
                },
                include:[
                    {
                        model:Prodi,
                        attributes:['nama','fakultas']
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getCatatanBap = async (req, res) =>{
    try {
        let kegiatan;
        let pencatat;
        let catatan;
        if(req.role === "mahasiswa")
        {
            if(req.params.kgt==="seminar")
            {
                const seminar = await Seminar.findOne({
                    where:{
                        uuid: req.params.id
                    }
                });
                if(!seminar) return res.status(404).json({msg: "Data seminar tidak ditemukan"});
                kegiatan = await db.query(
                    'SELECT proposal.judul, mahasiswa.nim, mahasiswa.nama '+
                    'FROM seminar '+
                    'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'WHERE seminar.id=:idd',{
                        replacements: { 
                            idd: seminar.id
                        },
                        type: QueryTypes.SELECT,
                        plain: true
                });
                pencatat = await db.query(
                    'SELECT DISTINCT(catatan.nama_field), dosen.uuid, dosen.nama '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: seminar.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
                catatan = await db.query(
                    'SELECT catatan.catatan, catatan.nama_field, dosen.uuid '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: seminar.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
            }else{
                const sidang = await Sidang.findOne({
                    where:{
                        uuid: req.params.id
                    }
                });
                if(!sidang) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
                kegiatan = await db.query(
                    'SELECT proposal.judul, mahasiswa.nim, mahasiswa.nama '+
                    'FROM sidang '+
                    'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'WHERE sidang.id=:idd',{
                        replacements: { 
                            idd: sidang.id
                        },
                        type: QueryTypes.SELECT,
                        plain: true
                });
                pencatat = await db.query(
                    'SELECT DISTINCT(catatan.nama_field), dosen.uuid, dosen.nama '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: sidang.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
                catatan = await db.query(
                    'SELECT catatan.catatan, dosen.uuid '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: sidang.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
            }
        }else if(req.role === "staff" || req.role === "dosen")
        {
            if(req.params.kgt==="seminar")
            {
                const seminar = await Seminar.findOne({
                    where:{
                        uuid: req.params.id
                    }
                });
                if(!seminar) return res.status(404).json({msg: "Data seminar tidak ditemukan"});
                kegiatan = await db.query(
                    'SELECT proposal.judul, seminar.waktu, mahasiswa.nim, mahasiswa.nama, periode.jenis as jenis_semester, periode.tahun_ajaran '+
                    'FROM seminar '+
                    'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                    'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'WHERE seminar.id=:idd',{
                        replacements: { 
                            idd: seminar.id
                        },
                        type: QueryTypes.SELECT,
                        plain: true
                });
                pencatat = await db.query(
                    'SELECT DISTINCT(catatan.nama_field), dosen.uuid, dosen.nama '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: seminar.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
                catatan = await db.query(
                    'SELECT catatan.catatan, dosen.uuid '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: seminar.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
            }else{
                const sidang = await Sidang.findOne({
                    where:{
                        uuid: req.params.id
                    }
                });
                if(!sidang) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
                kegiatan = await db.query(
                    'SELECT proposal.judul, sidang.ruang, sidang.waktu, mahasiswa.nim, mahasiswa.nama, periode.jenis as jenis_semester, periode.tahun_ajaran, '+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji, '+
                    '(SELECT dosen.nip FROM dosen WHERE dosen.id=sidang.ketua_penguji) as nip_ketua_penguji '+
                    'FROM sidang '+
                    'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                    'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'WHERE sidang.id=:idd',{
                        replacements: { 
                            idd: sidang.id
                        },
                        type: QueryTypes.SELECT,
                        plain: true
                });
                pencatat = await db.query(
                    'SELECT DISTINCT(catatan.nama_field), dosen.uuid, dosen.nama '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: sidang.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
                catatan = await db.query(
                    'SELECT catatan.catatan, catatan.nama_field, dosen.uuid '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: sidang.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
            }
        }else if(req.role === "dosen")
        {
            if(req.params.kgt==="seminar")
            {
                const seminar = await Seminar.findOne({
                    where:{
                        uuid: req.params.id
                    }
                });
                if(!seminar) return res.status(404).json({msg: "Data seminar tidak ditemukan"});
                kegiatan = await db.query(
                    'SELECT proposal.judul, seminar.waktu, mahasiswa.nim, mahasiswa.nama, periode.jenis as jenis_semester, periode.tahun_ajaran '+
                    'FROM seminar '+
                    'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                    'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'WHERE seminar.id=:idd',{
                        replacements: { 
                            idd: seminar.id
                        },
                        type: QueryTypes.SELECT,
                        plain: true
                });
                pencatat = await db.query(
                    'SELECT DISTINCT(catatan.nama_field), dosen.uuid, dosen.nama '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: seminar.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
                catatan = await db.query(
                    'SELECT catatan.catatan, dosen.uuid '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: seminar.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
            }else{
                const sidang = await Sidang.findOne({
                    where:{
                        uuid: req.params.id
                    }
                });
                if(!sidang) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
                kegiatan = await db.query(
                    'SELECT proposal.judul, sidang.waktu, mahasiswa.nim, mahasiswa.nama, periode.jenis as jenis_semester, periode.tahun_ajaran, '+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji, '+
                    '(SELECT dosen.nip FROM dosen WHERE dosen.id=sidang.ketua_penguji) as nip_ketua_penguji '+
                    'FROM sidang '+
                    'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                    'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'WHERE sidang.id=:idd',{
                        replacements: { 
                            idd: sidang.id
                        },
                        type: QueryTypes.SELECT,
                        plain: true
                });
                pencatat = await db.query(
                    'SELECT DISTINCT(catatan.nama_field), dosen.uuid, dosen.nama '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: sidang.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
                catatan = await db.query(
                    'SELECT catatan.catatan, dosen.uuid '+
                    'FROM catatan '+
                    'CROSS JOIN dosen ON dosen.id=catatan.id_penilai '+
                    'WHERE catatan.id_seminar_sidang=:idd AND catatan.kegiatan=:kgt',{
                        replacements: { 
                            idd: sidang.id,
                            kgt: req.params.kgt
                        },
                        type: QueryTypes.SELECT
                });
            }
        }
        res.status(200).json({kegiatan,pencatat,catatan});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getFormulirBap = async (req,res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await db.query(
                'SELECT DISTINCT(nilai.kegiatan) as nama, COUNT(nilai.kegiatan) as jumlah '+
                'FROM nilai '+
                'GROUP BY nilai.kegiatan',{
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
        }else if(req.role === "Mahasiswa"){
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
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getFormulirByIdKgt = async(req, res) =>{
    try {
        let kegiatan;
        let formulir;
        let lampiran;
        if(req.role === "admin"){
            kegiatan = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, prodi.uri as uriprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'WHERE seminar.uuid=:idd',{
                    replacements: { idd: req.params.id },
                    type: QueryTypes.SELECT,
                    plain: true
            });
            const prodi = await Prodi.findOne({
                where:{
                    uuid: kegiatan.idprodi
                }
            });
            if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
            formulir = await db.query(
                'SELECT uuid, kegiatan, nama_field, keterangan '+
                'FROM formulir '+
                'WHERE formulir.kegiatan=:kgt AND formulir.id_prodi=:idd',{
                    replacements: { idd: prodi.id,
                        kgt: req.params.kgt },
                    type: QueryTypes.SELECT
            });
            if(!formulir) return res.status(404).json({msg: "Data formulir tidak ditemukan"});
            lampiran = await db.query(
                'SELECT uuid, kegiatan, nama_file, keterangan '+
                'FROM lampiran_bap '+
                'WHERE lampiran_bap.kegiatan=:kgt AND lampiran_bap.id_prodi=:idd',{
                    replacements: { idd: prodi.id,
                        kgt: req.params.kgt },
                    type: QueryTypes.SELECT
            });
            if(!lampiran) return res.status(404).json({msg: "Data lampiran tidak ditemukan"});
        }else if(req.role === "staff"){
            kegiatan = await db.query(
                'SELECT '+req.params.kgt+'.uuid, '+req.params.kgt+'.waktu, '+req.params.kgt+'.ruang, '+req.params.kgt+'.nomor_bap, proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, prodi.nama as prodi, prodi.uuid as idprodi, prodi.uri as uriprodi, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu,'+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua '+
                'FROM '+req.params.kgt+' '+
                'CROSS JOIN proposal ON proposal.id='+req.params.kgt+'.id_proposal '+
                'CROSS JOIN periode ON periode.id='+req.params.kgt+'.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'WHERE '+req.params.kgt+'.uuid=:idd AND staff.id_user=:idu',{
                    replacements: { 
                        idd: req.params.id,
                        idu: req.userId
                    },
                    type: QueryTypes.SELECT,
                    plain: true
            });
            const prodi = await Prodi.findOne({
                where:{
                    uuid: kegiatan.idprodi
                }
            });
            if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
            formulir = await db.query(
                'SELECT uuid, kegiatan,nama_field,keterangan '+
                'FROM formulir '+
                'WHERE formulir.kegiatan=:kgt AND formulir.id_prodi=:idd',{
                    replacements: { idd: prodi.id,
                        kgt: req.params.kgt },
                    type: QueryTypes.SELECT
            });
            if(!formulir) return res.status(404).json({msg: "Data formulir tidak ditemukan"});
            lampiran = await db.query(
                'SELECT uuid, kegiatan, nama_file, keterangan '+
                'FROM lampiran_bap '+
                'WHERE lampiran_bap.kegiatan=:kgt AND lampiran_bap.id_prodi=:idd',{
                    replacements: { idd: prodi.id,
                        kgt: req.params.kgt },
                    type: QueryTypes.SELECT
            });
            if(!lampiran) return res.status(404).json({msg: "Data lampiran tidak ditemukan"});
        }
        res.status(200).json({kegiatan,formulir,lampiran});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getFormulirByIdNilai = async(req, res) =>{
    try {
        let kegiatan;
        let nilai;
        let komentar;
        if(req.role === "admin" || req.role ==="staff"){
            if(req.params.field==="pembimbing_satu" || req.params.field==="pembimbing_dua"){
                kegiatan = await db.query(
                    'SELECT '+req.params.kgt+'.uuid, '+req.params.kgt+'.waktu, '+req.params.kgt+'.ruang, '+req.params.kgt+'.nomor_bap, '+
                    'proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, '+
                    'periode.tahun_ajaran, periode.jenis as jenis_semester, prodi.nama as prodi, prodi.uuid as idprodi, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.'+req.params.field+') as idpenilai,'+
                    '(SELECT dosen.nip FROM dosen WHERE dosen.id=proposal.'+req.params.field+') as nippenilai,'+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.'+req.params.field+') as nama_penilai '+
                    'FROM '+req.params.kgt+' '+
                    'CROSS JOIN proposal ON proposal.id='+req.params.kgt+'.id_proposal '+
                    'CROSS JOIN periode ON periode.id='+req.params.kgt+'.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                    'WHERE '+req.params.kgt+'.uuid=:idd',{
                        replacements: { idd: req.params.id },
                        type: QueryTypes.SELECT,
                        plain: true
                });
            }else if(req.params.field==="ketua_penguji" || req.params.field==="penguji_satu" || req.params.field==="penguji_dua" || req.params.field==="penguji_tiga" || req.params.field==="penguji_empat"){
                kegiatan = await db.query(
                    'SELECT '+req.params.kgt+'.uuid, '+req.params.kgt+'.waktu, '+req.params.kgt+'.ruang, '+req.params.kgt+'.nomor_bap, '+
                    'proposal.judul, mahasiswa.nim, mahasiswa.nama as mahasiswa, periode.uuid as periode, '+
                    'periode.tahun_ajaran, periode.jenis as jenis_semester, prodi.nama as prodi, prodi.uuid as idprodi, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id='+req.params.kgt+'.'+req.params.field+') as idpenilai,'+
                    '(SELECT dosen.nip FROM dosen WHERE dosen.id='+req.params.kgt+'.'+req.params.field+') as nippenilai,'+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id='+req.params.kgt+'.'+req.params.field+') as nama_penilai '+
                    'FROM '+req.params.kgt+' '+
                    'CROSS JOIN proposal ON proposal.id='+req.params.kgt+'.id_proposal '+
                    'CROSS JOIN periode ON periode.id='+req.params.kgt+'.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                    'WHERE '+req.params.kgt+'.uuid=:idd',{
                        replacements: { idd: req.params.id },
                        type: QueryTypes.SELECT,
                        plain: true
                });
            }
            if(!kegiatan) return res.status(404).json({msg: "Kegiatan tidak ditemukan!"});
            const dosen = await Dosen.findOne({
                where:{
                    uuid: kegiatan.idpenilai
                }
            });
            if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
            nilai = await db.query(
                'SELECT nilai.uuid, skema_formulir.nama_nilai, skema_formulir.bobot, nilai.nilai '+
                'FROM nilai '+
                'CROSS JOIN skema_formulir ON skema_formulir.id=nilai.id_skema_formulir '+
                'CROSS JOIN '+req.params.kgt+' ON '+req.params.kgt+'.id=nilai.id_seminar_sidang '+
                'WHERE nilai.kegiatan=:kgt AND '+req.params.kgt+'.uuid=:idd AND nilai.id_penilai=:ipn AND nilai.nama_field=:nf',{
                    replacements: { idd: req.params.id,
                        kgt: req.params.kgt,
                        nf: req.params.field,
                        ipn: dosen.id },
                    type: QueryTypes.SELECT
            });
            if(!nilai) return res.status(404).json({msg: "Data nilai tidak ditemukan"});
            komentar = await db.query(
                'SELECT catatan.uuid, catatan.catatan '+
                'FROM catatan '+
                'CROSS JOIN '+req.params.kgt+' ON '+req.params.kgt+'.id=catatan.id_seminar_sidang '+
                'WHERE catatan.kegiatan=:kgt AND '+req.params.kgt+'.uuid=:idd AND catatan.id_penilai=:ipn AND catatan.nama_field=:nf',{
                    replacements: { idd: req.params.id,
                        kgt: req.params.kgt,
                        nf: req.params.field,
                        ipn: dosen.id },
                    type: QueryTypes.SELECT
            });
            if(!komentar) return res.status(404).json({msg: "Data nilai tidak ditemukan"});
        }
        res.status(200).json({kegiatan,nilai,komentar});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getBapById = async(req, res) =>{
    try {
        const response = await Bap.findOne({
            attributes:['uuid','kegiatan','nama_file','keterangan'],
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

export const createBap = async(req, res) =>{
    const {kegiatan, namafile, keterangan, idprodi} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        await Bap.create({
            kegiatan: kegiatan,
            nama_file: namafile,
            keterangan: keterangan,
            id_prodi: prodi.id
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateBap = async(req, res) =>{
    const form = await Bap.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!form) return res.status(404).json({msg: "Bap tidak ditemukan"});
    const {kegiatan, namafile, keterangan, idprodi} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        await Bap.update({
            kegiatan: kegiatan,
            nama_file: namafile,
            keterangan: keterangan,
            id_prodi: prodi.id
        },{
            where:{
                id: form.id
            }
        });
        res.status(200).json({msg: "File Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteBap = async(req, res) =>{
    const form = await Bap.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!form) return res.status(404).json({msg: "Bap tidak ditemukan"});
    try {
        await Bap.destroy({
            where:{
                id: form.id
            }
        });
        res.status(200).json({msg: "Bap Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}