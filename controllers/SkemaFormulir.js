import Skema from "../models/SkemaFormulirModel.js";
import Formulir from "../models/FormulirModel.js";
import Seminar from "../models/SeminarModel.js";

export const getSkemaFormulir = async(req, res) =>{
    try {
        const form = await Formulir.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!form) return res.status(404).json({msg: "Data formulir tidak ditemukan"});
        const response = await Skema.findAll({
            attributes:['uuid','nama_nilai','bobot'],
            where: {
                id_formulir: form.id
            },
            include:[
                {
                    model: Formulir,
                    attributes: ['keterangan']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getSkemaFormulirById = async(req, res) =>{
    try {
        const response = await Skema.findOne({
            attributes:['uuid','nama_nilai','bobot'],
            where: {
                uuid: req.params.id
            },
            include:[
                {
                    model: Formulir,
                    attributes: ['uuid','keterangan']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createSkemaFormulir = async(req, res) =>{
    const {namanilai, bobot, idformulir} = req.body;
    try {
        const form = await Formulir.findOne({
            where:{
                uuid: idformulir
            }
        });
        if(!form) return res.status(404).json({msg: "Data formulir tidak ditemukan"});
        await Skema.create({
            nama_nilai: namanilai,
            bobot: bobot,
            id_formulir: form.id
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateSkemaFormulir = async(req, res) =>{
    const skema = await Skema.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!skema) return res.status(404).json({msg: "Skema formulir tidak ditemukan"});
    const {namanilai, bobot, idformulir} = req.body;
    try {
        const form = await Formulir.findOne({
            where:{
                uuid: idformulir
            }
        });
        if(!form) return res.status(404).json({msg: "Data Formulir tidak ditemukan"});
        await Skema.update({
            nama_nilai: namanilai,
            bobot: bobot,
            id_formulir: form.id
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

export const deleteSkemaFormulir = async(req, res) =>{
    const skema = await Skema.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!skema) return res.status(404).json({msg: "Skema Formulir tidak ditemukan"});
    try {
        await Skema.destroy({
            where:{
                id: skema.id
            }
        });
        res.status(200).json({msg: "Sekema Formulir Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}