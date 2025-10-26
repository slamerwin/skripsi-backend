import Formulir from "../models/FormulirModel.js";
import Prodi from "../models/ProdiModel.js";
import Kaprodi from "../models/KaprodiModel.js";

export const getFormulir = async(req, res) =>{
    try {
        let response
        if(req.role === "admin")
        {
            response = await Formulir.findAll({
                attributes:['uuid','kegiatan','nama_field','keterangan'],
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
            response = await Formulir.findAll({
                attributes:['uuid','kegiatan','nama_field','keterangan'],
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

export const getFormulirById = async(req, res) =>{
    try {
        const response = await Formulir.findOne({
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

export const createFormulir = async(req, res) =>{
    const {kegiatan, namafield, keterangan, idprodi} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        await Formulir.create({
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

export const updateFormulir = async(req, res) =>{
    const form = await Formulir.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!form) return res.status(404).json({msg: "Formulir tidak ditemukan"});
    const {kegiatan, namafield, keterangan, idprodi} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        await Formulir.update({
            kegiatan: kegiatan,
            nama_field: namafield,
            keterangan: keterangan,
            id_prodi: prodi.id
        },{
            where:{
                id: form.id
            }
        });
        res.status(200).json({msg: "Formulir Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteFormulir = async(req, res) =>{
    const form = await Formulir.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!form) return res.status(404).json({msg: "Formulir tidak ditemukan"});
    try {
        await Formulir.destroy({
            where:{
                id: form.id
            }
        });
        res.status(200).json({msg: "Formulir Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}