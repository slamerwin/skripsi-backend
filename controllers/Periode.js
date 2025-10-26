import Periode from "../models/PeriodeModel.js";

export const getPeriode = async(req, res) =>{
    try {
        const response = await Periode.findAll({
            attributes:['uuid','kode_semester','tahun_ajaran','jenis','tanggal_mulai', 'tanggal_selesai','keterangan']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getPeriodeById = async(req, res) =>{
    try {
        const response = await Periode.findOne({
            attributes:['uuid','kode_semester','tahun_ajaran','jenis','tanggal_mulai', 'tanggal_selesai','keterangan'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createPeriode = async(req, res) =>{
    const {kode_semester,tahun_ajaran,jenis,tanggal_mulai,tanggal_selesai,keterangan} = req.body;
    try {
        await Periode.create({
            kode_semester: kode_semester,
            tahun_ajaran: tahun_ajaran,
            jenis:jenis,
            tanggal_mulai:tanggal_mulai,
            tanggal_selesai:tanggal_selesai,
            keterangan:keterangan
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updatePeriode = async(req, res) =>{
    const periode = await Periode.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!periode) return res.status(404).json({msg: "Periode tidak ditemukan"});
    const {kode_semester,tahun_ajaran,jenis,tanggal_mulai,tanggal_selesai,keterangan} = req.body;
    try {
        await Periode.update({
            kode_semester: kode_semester,
            tahun_ajaran: tahun_ajaran,
            jenis:jenis,
            tanggal_mulai:tanggal_mulai,
            tanggal_selesai:tanggal_selesai,
            keterangan:keterangan
        },{
            where:{
                id: periode.id
            }
        });
        res.status(200).json({msg: "Periode Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deletePeriode = async(req, res) =>{
    const periode = await Periode.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!periode) return res.status(404).json({msg: "Periode tidak ditemukan"});
    try {
        await Periode.destroy({
            where:{
                id: periode.id
            }
        });
        res.status(200).json({msg: "Periode Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}