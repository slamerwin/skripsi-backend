import Ceklis from "../models/CeklisModel.js";
import Prodi from "../models/ProdiModel.js";
import Kaprodi from "../models/KaprodiModel.js";
import Proposal from "../models/ProposalModel.js";

export const getCeklis = async(req, res) =>{
    try {
        const response = await Ceklis.findAll({
            attributes:['uuid','kegiatan','keterangan'],
            include:[
                {
                    model:Prodi,
                    attributes:['uuid','nama','fakultas']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getCeklisProdi = async(req, res) =>{
    try {
        const kaprodi = await Kaprodi.findOne({
            where:{
                id_user: req.userId
            }
        });
        if(!kaprodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        const response = await Ceklis.findAll({
            attributes:['uuid','kegiatan','keterangan'],
            where: {
                aktif: 1,
                id_prodi: kaprodi.id_prodi
            },
            include:[
                {
                    model:Prodi,
                    attributes:['uuid','nama','fakultas']
                }
            ],
            order:['kegiatan']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getCeklisProdiByProp = async(req, res) =>{
    try {
        const proposal = await Proposal.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!proposal) return res.status(404).json({msg: "Data proposal tidak ditemukan"});
        const response = await Ceklis.findAll({
            attributes:['uuid','kegiatan','keterangan'],
            where: {
                aktif: 1,
                id_prodi: proposal.id_prodi,
                kegiatan: req.params.kgt
            },
            include:[
                {
                    model:Prodi,
                    attributes:['uuid','nama','fakultas']
                }
            ],
            order:['kegiatan']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getCeklisById = async(req, res) =>{
    try {
        const response = await Ceklis.findOne({
            attributes:['uuid','kegiatan','keterangan'],
            where: {
                uuid: req.params.id,
                aktif: 1
            },
            include:[
                {
                    model:Prodi,
                    attributes:['uuid','nama','fakultas']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createCeklis = async(req, res) =>{
    const {kegiatan, keterangan, idprodi} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        await Ceklis.create({
            kegiatan: kegiatan,
            aktif: 1,
            keterangan: keterangan,
            id_prodi: prodi.id
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateCeklis = async(req, res) =>{
    const form = await Ceklis.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!form) return res.status(404).json({msg: "Ceklis tidak ditemukan"});
    const {kegiatan, keterangan} = req.body;
    try {
        await Ceklis.update({
            kegiatan: kegiatan,
            keterangan: keterangan
        },{
            where:{
                id: form.id
            }
        });
        res.status(200).json({msg: "Ceklis Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteCeklis = async(req, res) =>{
    const form = await Ceklis.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!form) return res.status(404).json({msg: "Ceklis tidak ditemukan"});
    try {
        await Ceklis.update({
            aktif: 0
        },{
            where:{
                id: form.id
            }
        });
        res.status(200).json({msg: "Ceklis Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}