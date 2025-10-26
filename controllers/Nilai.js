import Skema from "../models/SkemaFormulirModel.js";
import Formulir from "../models/FormulirModel.js";
import Dosen from "../models/DosenModel.js";
import Periode from "../models/PeriodeModel.js";
import Nilai from "../models/NilaiModel.js";
import Catatan from "../models/CatatanModel.js";
import Seminar from "../models/SeminarModel.js";
import Sidang from "../models/SidangModel.js";
import db from "../config/Database.js";
import {Op,QueryTypes} from "sequelize";

export const getNilai = async(req, res) =>{
    try {
        let kegiatan;
        let kriteria;
        let komentar;
        if(req.params.kgt==='seminar')
        {
            kegiatan = await db.query(
                'SELECT seminar.uuid, seminar.waktu, seminar.ruang, seminar.nomor_bap, seminar.ttd_'+req.params.field+' as ttd, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, prodi.uuid as idprodi, prodi.nama as prodi, periode.uuid as periode, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu, '+
                '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua, '+
                '(SELECT dosen.uuid FROM dosen WHERE dosen.id=seminar.'+req.params.field+') as idpenilai '+
                'FROM seminar '+
                'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                'WHERE seminar.uuid=:idd',{
                    replacements: { idd: req.params.smnr },
                    type: QueryTypes.SELECT,
                    plain: true
            });
            if(!kegiatan) return res.status(404).json({msg: "Data seminar tidak ditemukan"});
            kriteria = await db.query(
                'SELECT skema_formulir.uuid, skema_formulir.nama_nilai, skema_formulir.bobot, nilai.uuid as idnilai, nilai.nilai as value '+
                'FROM skema_formulir '+
                'CROSS JOIN formulir ON skema_formulir.id_formulir=formulir.id '+
                'CROSS JOIN proposal ON formulir.id_prodi=proposal.id_prodi '+
                'CROSS JOIN seminar ON proposal.id=seminar.id_proposal '+
                'LEFT JOIN nilai ON nilai.id_seminar_sidang=seminar.id AND nilai.id_skema_formulir=skema_formulir.id AND nilai.id_penilai=seminar.'+req.params.field+' '+
                'WHERE formulir.nama_field=:nf AND formulir.kegiatan=:kgt AND seminar.uuid=:smnr',{
                    type: QueryTypes.SELECT,
                    replacements: { 
                        nf: req.params.field,
                        kgt: req.params.kgt,
                        smnr: req.params.smnr
                    }
            })
            if(!kriteria) return res.status(404).json({msg: "Data kriteria tidak ditemukan"});
            komentar = await db.query(
                'SELECT catatan.uuid as idkomen, catatan.catatan as koment, (0) as hapus '+
                'FROM catatan '+
                'CROSS JOIN seminar ON seminar.id=catatan.id_seminar_sidang '+
                'WHERE catatan.nama_field=:nf AND catatan.kegiatan=:kgt AND seminar.uuid=:smnr',{
                    type: QueryTypes.SELECT,
                    replacements: { 
                        nf: req.params.field,
                        kgt: req.params.kgt,
                        smnr: req.params.smnr
                    }
            })
            if(!komentar) return res.status(404).json({msg: "Data kriteria tidak ditemukan"});
        }else{
            if(req.params.field==='pembimbing_satu' || req.params.field==='pembimbing_dua')
            {
                kegiatan = await db.query(
                    'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, prodi.uuid as idprodi, prodi.nama as prodi, periode.uuid as periode, '+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu, '+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.'+req.params.field+') as idpenilai '+
                    'FROM sidang '+
                    'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                    'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                    'WHERE sidang.uuid=:idd',{
                        replacements: { idd: req.params.smnr },
                        type: QueryTypes.SELECT,
                        plain: true
                });
                if(!kegiatan) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
                kriteria = await db.query(
                    'SELECT skema_formulir.uuid, skema_formulir.nama_nilai, skema_formulir.bobot, nilai.uuid as idnilai, nilai.nilai as value '+
                    'FROM skema_formulir '+
                    'CROSS JOIN formulir ON skema_formulir.id_formulir=formulir.id '+
                    'CROSS JOIN proposal ON formulir.id_prodi=proposal.id_prodi '+
                    'CROSS JOIN sidang ON proposal.id=sidang.id_proposal '+
                    'LEFT JOIN nilai ON nilai.id_seminar_sidang=sidang.id AND nilai.id_skema_formulir=skema_formulir.id AND nilai.id_penilai=proposal.'+req.params.field+' '+
                    'WHERE formulir.nama_field=:nf AND formulir.kegiatan=:kgt AND sidang.uuid=:smnr',{
                        type: QueryTypes.SELECT,
                        replacements: { 
                            nf: req.params.field,
                            kgt: req.params.kgt,
                            smnr: req.params.smnr
                        }
                })
                if(!kriteria) return res.status(404).json({msg: "Data kriteria tidak ditemukan"});
            }else{
                kegiatan = await db.query(
                    'SELECT sidang.uuid, sidang.waktu, sidang.ruang, sidang.nomor_bap, proposal.judul, proposal.status, mahasiswa.nim, mahasiswa.nama as mahasiswa, prodi.uuid as idprodi, prodi.nama as prodi, periode.uuid as periode, '+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as pembimbing_satu, '+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as pembimbing_dua, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.'+req.params.field+') as idpenilai '+
                    'FROM sidang '+
                    'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                    'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'CROSS JOIN prodi ON prodi.id=proposal.id_prodi '+
                    'WHERE sidang.uuid=:idd',{
                        replacements: { idd: req.params.smnr },
                        type: QueryTypes.SELECT,
                        plain: true
                });
                if(!kegiatan) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
                kriteria = await db.query(
                    'SELECT skema_formulir.uuid, skema_formulir.nama_nilai, skema_formulir.bobot, nilai.uuid as idnilai, nilai.nilai as value '+
                    'FROM skema_formulir '+
                    'CROSS JOIN formulir ON skema_formulir.id_formulir=formulir.id '+
                    'CROSS JOIN proposal ON formulir.id_prodi=proposal.id_prodi '+
                    'CROSS JOIN sidang ON proposal.id=sidang.id_proposal '+
                    'LEFT JOIN nilai ON nilai.id_seminar_sidang=sidang.id AND nilai.id_skema_formulir=skema_formulir.id AND nilai.id_penilai=sidang.'+req.params.field+' '+
                    'WHERE formulir.nama_field=:nf AND formulir.kegiatan=:kgt AND sidang.uuid=:smnr',{
                        type: QueryTypes.SELECT,
                        replacements: { 
                            nf: req.params.field,
                            kgt: req.params.kgt,
                            smnr: req.params.smnr
                        }
                })
                if(!kriteria) return res.status(404).json({msg: "Data kriteria tidak ditemukan"});
            }
            komentar = await db.query(
                'SELECT catatan.uuid as idkomen, catatan.catatan as koment, (0) as hapus '+
                'FROM catatan '+
                'CROSS JOIN sidang ON sidang.id=catatan.id_seminar_sidang '+
                'WHERE catatan.nama_field=:nf AND catatan.kegiatan=:kgt AND sidang.uuid=:smnr',{
                    type: QueryTypes.SELECT,
                    replacements: { 
                        nf: req.params.field,
                        kgt: req.params.kgt,
                        smnr: req.params.smnr
                    }
            })
            if(!komentar) return res.status(404).json({msg: "Data kriteria tidak ditemukan"});
        }
        res.status(200).json({kegiatan,kriteria,komentar});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getAllNilaiByPeriode = async(req, res) =>{
    try {
        let kegiatan;
        let nilai;
        let kriteria;
        let kelengkapan;
        let namfield=[];
        let temp=['No','NIM','Nama','Tanggal Sidang'];
        let komplit=[];
        let kerquer=[];
        if(req.role==="kaprodi")
        {
            const periode = await Periode.findOne({
                where:{
                    uuid: req.params.prd
                }
            });
            if(!periode) return res.status(404).json({msg: "Data periode tidak ditemukan"});
            kelengkapan = await db.query(
                'SELECT periode.tahun_ajaran, periode.jenis as jenis_semester, dosen.nama, dosen.nip '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=proposal.id_prodi '+
                'CROSS JOIN dosen ON dosen.id=kaprodi.id_dosen '+
                //'CROSS JOIN staff ON staff.id_prodi=proposal.id_prodi '+
                'WHERE sidang.id_periode=:idd AND kaprodi.id_user=:idu',{
                    replacements: { 
                        idd: periode.id,
                        idu: req.userId
                    },
                    type: QueryTypes.SELECT,
                    plain: true
            });
            if(!kelengkapan) return res.status(404).json({msg: "Data kelengkapan tidak ditemukan"});
            kegiatan = await db.query(
                'SELECT proposal.judul, sidang.uuid as id_sidang, sidang.waktu, mahasiswa.nim, mahasiswa.nama '+
                'FROM sidang '+
                'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                'WHERE sidang.id_periode=:idd',{
                    replacements: { 
                        idd: periode.id
                    },
                    type: QueryTypes.SELECT
            });
            if(!kegiatan) return res.status(404).json({msg: "Data kegiatan tidak ditemukan"});
            kriteria = await db.query(
                'SELECT skema_formulir.nama_nilai, formulir.nama_field, skema_formulir.uuid as id_soal, (CASE WHEN formulir.nama_field="ketua_penguji" OR formulir.nama_field="penguji_satu" OR formulir.nama_field="penguji_dua" OR formulir.nama_field="penguji_tiga" OR formulir.nama_field="penguji_empat" THEN "penguji" WHEN formulir.nama_field="pembimbing_satu" OR formulir.nama_field="pembimbing_dua" THEN "pembimbing" ELSE "TAK TAHU" END) as status '+
                'FROM skema_formulir '+
                'CROSS JOIN formulir ON formulir.id=skema_formulir.id_formulir '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=formulir.id_prodi '+
                'WHERE kaprodi.id_user=:idu AND formulir.kegiatan=:kgt AND formulir.aktif=1',{
                    replacements: { 
                        idu: req.userId,
                        kgt: req.params.kgt
                    },
                    type: QueryTypes.SELECT
            });
            if(!kriteria) return res.status(404).json({msg: "Data kriteria tidak ditemukan"});
            nilai = await db.query(
                'SELECT sidang.uuid as id_sidang, nilai.kegiatan, nilai.nama_field, nilai.nilai, skema_formulir.nama_nilai, skema_formulir.bobot, skema_formulir.uuid as id_soal, (CASE WHEN nilai.nama_field="ketua_penguji" OR nilai.nama_field="penguji_satu" OR nilai.nama_field="penguji_dua" OR nilai.nama_field="penguji_tiga" OR nilai.nama_field="penguji_empat" THEN "penguji" WHEN nilai.nama_field="pembimbing_satu" OR nilai.nama_field="pembimbing_dua" THEN "pembimbing" ELSE "TAK TAHU" END) as status '+
                'FROM nilai '+
                'CROSS JOIN skema_formulir ON skema_formulir.id=nilai.id_skema_formulir '+
                'CROSS JOIN sidang ON sidang.id=nilai.id_seminar_sidang '+
                'WHERE sidang.id_periode=:aci AND nilai.kegiatan=:kgt',{
                    replacements: {
                        aci: periode.id,
                        kgt: req.params.kgt
                    },
                    type: QueryTypes.SELECT
                }
            );
            if(!nilai) return res.status(404).json({msg: "Data nilai tidak ditemukan"});
            let key;
            let count=1;
            let cek;
            let status;
            for(key in kriteria)
            {
                if(key===0){ cek = kriteria[key].nama_field; status = kriteria[key].status; }
                if(cek!==kriteria[key].nama_field)
                {
                    if(status==="penguji"){ temp.push('Total');kerquer.push("Total"); }
                    namfield.push([cek,count]);
                    cek = kriteria[key].nama_field;
                    status = kriteria[key].status;
                    if(status==="pembimbing") count=0; else count=1;
                }
                count++;
                temp.push(kriteria[key].nama_field+" "+kriteria[key].nama_nilai);
                kerquer.push([kriteria[key].nama_field,kriteria[key].id_soal]);
            }
            temp.push('Pembimbing');
            kerquer.push("Total");
            namfield.push([cek,count]);
            komplit.push(temp);
            kerquer.push("TotPeng");
            kerquer.push("Sum");
            temp=[];
            let k1, k2, k3;
            let taktemu=true;
            let sum=0;
            let totpeng=0;
            let totpemb=0;
            let nampeng;
            for(k1 in kegiatan)
            {
                temp.push(parseInt(k1)+1);
                temp.push(kegiatan[k1].nim);
                temp.push(kegiatan[k1].nama);
                temp.push(kegiatan[k1].waktu.toLocaleDateString("in-ID"));
                for(k2 in kerquer)
                {
                    if(kerquer[k2]==="Sum")
                    {
                        temp.push(((totpeng*0.4)+(totpemb*0.6)).toFixed(2));
                        totpeng=0;
                        totpemb=0;
                    }else if(kerquer[k2]==="TotPeng")
                    {
                        temp.push(totpeng.toFixed(2));
                    }else if(kerquer[k2]!=="Total")
                    {
                        taktemu=true;
                        for(k3 in nilai)
                        {
                            if(nilai[k3].id_sidang===kegiatan[k1].id_sidang && nilai[k3].id_soal===kerquer[k2][1] && nilai[k3].nama_field===kerquer[k2][0]){ temp.push(nilai[k3].nilai); sum+=nilai[k3].nilai*nilai[k3].bobot; taktemu=false; break;}
                            nampeng = nilai[k3].nama_field;
                        }
                        if(taktemu) temp.push(0);
                    }else{
                        if(nampeng==="ketua_penguji")
                        {
                            totpeng += sum*0.15;
                        }else if(nampeng==="penguji_satu")
                        {
                            totpeng += sum*0.1;
                        }else if(nampeng==="penguji_dua")
                        {
                            totpeng += sum*0.25;
                        }else if(nampeng==="penguji_tiga")
                        {
                            totpeng += sum*0.25;
                        }else if(nampeng==="penguji_empat")
                        {
                            totpeng += sum*0.25;
                        }
                        temp.push(sum.toFixed(2));
                        totpemb=sum;
                        sum=0;
                    }
                }
                komplit.push(temp);
                temp=[];
            }
        }
        res.status(200).json({kelengkapan,namfield,komplit});
    }catch(error){
        res.status(500).json({msg: error.message});
    }
}

export const getNilaiById = async(req, res) =>{
    try {
        const response = await Nilai.findOne({
            attributes:['uuid','kegiatan','nilai'],
            where: {
                uuid: req.params.id
            },
            include:[
                {
                    model: Dosen,
                    attributes: ['nama']
                },{
                    model: Skema,
                    attributes: ['nama_nilai','bobot']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getNilaiByKgt = async(req, res) =>{
    try {
        let kegiatan;
        let nilai;
        let acara;
	let ididpenguji="";
        if(req.role==="staff" || req.role==="dosen")
        {
            if(req.params.kgt==="seminar")
            {
                acara = await Seminar.findOne({
                    where:{
                        uuid: req.params.id
                    }
                });
                kegiatan = await db.query(
                    'SELECT proposal.judul, seminar.waktu, mahasiswa.nim, mahasiswa.nama, periode.jenis as jenis_semester, periode.tahun_ajaran, '+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=seminar.penguji_satu) as ketua_penguji, '+
                    '(SELECT dosen.nip FROM dosen WHERE dosen.id=seminar.penguji_satu) as nip_ketua_penguji '+
                    'FROM seminar '+
                    'CROSS JOIN proposal ON proposal.id=seminar.id_proposal '+
                    'CROSS JOIN periode ON periode.id=seminar.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'WHERE seminar.id=:idd',{
                        replacements: { 
                            idd: acara.id
                        },
                        type: QueryTypes.SELECT,
                        plain: true
                });
		ididpenguji="("+acara.penguji_satu+","+acara.penguji_dua+","+acara.penguji_tiga+")";
            }else{
                acara = await Sidang.findOne({
                    where:{
                        uuid: req.params.id
                    }
                });
                kegiatan = await db.query(
                    'SELECT proposal.judul, sidang.waktu, mahasiswa.nim, mahasiswa.nama, periode.jenis as jenis_semester, periode.tahun_ajaran, '+
                    '(SELECT dosen.nama FROM dosen WHERE dosen.id=sidang.ketua_penguji) as ketua_penguji, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.ketua_penguji) as id_ketua_penguji, '+
                    '(SELECT dosen.nip FROM dosen WHERE dosen.id=sidang.ketua_penguji) as nip_ketua_penguji, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_satu) as id_penguji_satu, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_dua) as id_penguji_dua, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_tiga) as id_penguji_tiga, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=sidang.penguji_empat) as id_penguji_empat, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_satu) as id_pembimbing_satu, '+
                    '(SELECT dosen.uuid FROM dosen WHERE dosen.id=proposal.pembimbing_dua) as id_pembimbing_dua '+
                    'FROM sidang '+
                    'CROSS JOIN proposal ON proposal.id=sidang.id_proposal '+
                    'CROSS JOIN periode ON periode.id=sidang.id_periode '+
                    'CROSS JOIN mahasiswa ON mahasiswa.id=proposal.id_mahasiswa '+
                    'WHERE sidang.id=:idd',{
                        replacements: { 
                            idd: acara.id
                        },
                        type: QueryTypes.SELECT,
                        plain: true
                });
		ididpenguji="("+acara.penguji_satu+","+acara.penguji_dua+","+acara.penguji_tiga+","+acara.ketua_penguji+","+acara.penguji_empat+")";
            }
            if(!acara) return res.status(404).json({msg: "Data kegiatan tidak ditemukan"});
            nilai = await db.query(
                'SELECT nilai.kegiatan, nilai.nama_field, nilai.nilai, skema_formulir.nama_nilai, skema_formulir.bobot, (CASE WHEN nilai.nama_field="ketua_penguji" OR nilai.nama_field="penguji_satu" OR nilai.nama_field="penguji_dua" OR nilai.nama_field="penguji_tiga" OR nilai.nama_field="penguji_empat" THEN "penguji" WHEN nilai.nama_field="pembimbing_satu" OR nilai.nama_field="pembimbing_dua" THEN "pembimbing" ELSE "TAK TAHU" END) as status '+
                'FROM nilai '+
                'CROSS JOIN skema_formulir ON skema_formulir.id=nilai.id_skema_formulir '+
                'WHERE nilai.id_seminar_sidang=:aci AND nilai.kegiatan=:kgt AND id_penilai IN '+ididpenguji+'',{
                    replacements: {
                        aci: acara.id,
                        kgt: req.params.kgt
                    },
                    type: QueryTypes.SELECT
                }
            );
                
        }
        res.status(200).json({kegiatan,nilai});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const bulkCreateNilai = async(req, res) => {
    try{
        const dosen = await Dosen.findOne({
            where:{
                uuid: req.body.idpenilai
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
        let semsid;
        if(req.body.kegiatan==='seminar')
        {
            semsid = await Seminar.findOne({
                where:{
                    uuid: req.body.idsemsid
                }
            });
            if(!semsid) return res.status(404).json({msg: "Data seminar tidak ditemukan"});
        }else{
            semsid = await Sidang.findOne({
                where:{
                    uuid: req.body.idsemsid
                }
            });
            if(!semsid) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
        }
        let key;
        for(key in req.body.nilai)
        {
            const skema = await Skema.findOne({
                where:{
                    uuid: req.body.nilai[key].uuid
                }
            });
            if(!skema) return res.status(404).json({msg: "Data pertanyaan(skema) tidak ditemukan"});
            if(req.body.nilai[key].idnilai===null && req.body.nilai[key].value!==null){
                const nilai = await Nilai.findOne({
                    where: {
                        kegiatan: req.body.kegiatan,
                        id_skema_formulir: skema.id,
                        nama_field: req.body.namafield,
                        id_penilai: dosen.id,
                        id_seminar_sidang: semsid.id
                    }
                });
                if(!nilai){
                    await Nilai.create({
                        kegiatan: req.body.kegiatan,
                        id_skema_formulir: skema.id,
                        nama_field: req.body.namafield,
                        id_penilai: dosen.id,
                        nilai: req.body.nilai[key].value,
                        id_seminar_sidang: semsid.id
                    });
                    console.log("Tambah Baru "+req.body.nilai[key].nama_nilai);
                }  
            } else if(req.body.nilai[key].idnilai!==null && req.body.nilai[key].value!==null){ 
                const nilai = await Nilai.findOne({
                    where: {
                        uuid: req.body.nilai[key].idnilai
                    }
                });
                if(!nilai) return res.status(404).json({msg: "Data nilai tidak ditemukan"});
                await Nilai.update({
                    kegiatan: req.body.kegiatan,
                    id_skema_formulir: skema.id,
                    nama_field: req.body.namafield,
                    id_penilai: dosen.id,
                    nilai: req.body.nilai[key].value,
                    id_seminar_sidang: semsid.id
                },{
                    where:{
                        id: nilai.id
                    }
                });
                console.log("Edit Nilai "+req.body.nilai[key].nama_nilai);
            }else {
                console.log("Tidak diapa-apakan "+req.body.nilai[key].nama_nilai);
            }
        }
        for(key in req.body.komentar)
        {
            if(req.body.komentar[key].idkomen===null && req.body.komentar[key].hapus===0)
            {
                const catat= await Catatan.findOne({
                    where: {
                        kegiatan: req.body.kegiatan,
                        nama_field: req.body.namafield,
                        id_penilai: dosen.id,
                        catatan: req.body.komentar[key].koment,
                        id_seminar_sidang: semsid.id
                    }
                });
                if(!catat){
                    await Catatan.create({
                        kegiatan: req.body.kegiatan,
                        nama_field: req.body.namafield,
                        id_penilai: dosen.id,
                        catatan: req.body.komentar[key].koment,
                        id_seminar_sidang: semsid.id
                    });
                    console.log('Tambah komentar'+req.body.komentar[key].koment);
                }
            }else if(req.body.komentar[key].idkomen!==null && req.body.komentar[key].hapus===1)
            {
                const catat = await Catatan.findOne({
                    where: {
                        uuid: req.body.komentar[key].idkomen
                    }
                });
                if(!catat) return res.status(404).json({msg: "Data catatan tidak ditemukan"});
                await Catatan.destroy({
                    where:{
                        id: catat.id
                    }
                });
                console.log('Hapus komentar'+req.body.komentar[key].koment);
            }
        }
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const createNilai = async(req, res) =>{
    const {kegiatan, nilai, namafield, idskema, idpenilai, idsemsid} = req.body;
    try {
        const skema = await Skema.findOne({
            where:{
                uuid: idskema
            }
        });
        if(!skema) return res.status(404).json({msg: "Data skema tidak ditemukan"});
        const dosen = await Dosen.findOne({
            where:{
                uuid: idpenilai
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
        if(kegiatan==="seminar")
        {
            const semsid = await Seminar.findOne({
                where:{
                    uuid: idsemsid
                }
            });
            if(!semsid) return res.status(404).json({msg: "Data seminar tidak ditemukan"});
        }else{
            const semsid = await Sidang.findOne({
                where:{
                    uuid: idsemsid
                }
            });
            if(!semsid) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
        }
        await Nilai.create({
            kegiatan: kegiatan,
            id_skema_formulir: skema.id,
            nama_field: namafield,
            id_penilai: dosen.id,
            nilai: nilai,
            id_seminar_sidang: semsid.id
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateNilai = async(req, res) =>{
    const nilai = await Nilai.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!nilai) return res.status(404).json({msg: "Data nilai tidak ditemukan"});
    const {kegiatan, nilaitf, namafield, idskema, idpenilai, idsemsid} = req.body;
    try {
        const skema = await Skema.findOne({
            where:{
                uuid: idskema
            }
        });
        if(!skema) return res.status(404).json({msg: "Data skema tidak ditemukan"});
        const dosen = await Dosen.findOne({
            where:{
                uuid: idpenilai
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
        if(kegiatan==="seminar")
        {
            const semsid = await Seminar.findOne({
                where:{
                    uuid: idsemsid
                }
            });
            if(!semsid) return res.status(404).json({msg: "Data seminar tidak ditemukan"});
        }else{
            const semsid = await Sidang.findOne({
                where:{
                    uuid: idsemsid
                }
            });
            if(!semsid) return res.status(404).json({msg: "Data sidang tidak ditemukan"});
        }
        await Nilai.update({
            kegiatan: kegiatan,
            id_skema_formulir: skema.id,
            nama_field: namafield,
            id_penilai: dosen.id,
            nilai: nilaitf,
            id_seminar_sidang: semsid.id
        },{
            where:{
                id: skema.id
            }
        });
        res.status(200).json({msg: "Skema Formulir Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteNilai = async(req, res) =>{
    const nilai = await Nilai.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!nilai) return res.status(404).json({msg: "Nilai tidak ditemukan"});
    try {
        await Nilai.destroy({
            where:{
                id: nilai.id
            }
        });
        res.status(200).json({msg: "Nilai Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
