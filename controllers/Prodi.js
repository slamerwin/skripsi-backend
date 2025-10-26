import Prodi from "../models/ProdiModel.js";
import db from "../config/Database.js";
import {Op,Sequelize,QueryTypes} from "sequelize";

export const getProdi = async(req, res) =>{
    try {
        const response = await Prodi.findAll({
            attributes:['uuid','nama','fakultas','uri']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProdiById = async(req, res) =>{
    try {
        const response = await Prodi.findOne({
            attributes:['uuid','nama','fakultas','uri'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProdiByUser = async(req, res) =>{
    try {
        const response = await db.query(
                'SELECT prodi.uuid, prodi.nama, prodi.fakultas, prodi.uri '+
                'FROM prodi '+
                'CROSS JOIN kaprodi ON kaprodi.id_prodi=prodi.id '+
                'WHERE kaprodi.id_user=:usr',{
                    type: QueryTypes.SELECT,
		    plain: true,
		    replacements: {usr:req.userId}   
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createProdi = async(req, res) =>{
    const {nama, fakultas, uri} = req.body;
    try {
        await Prodi.create({
            nama: nama,
            fakultas: fakultas,
            uri: uri
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateProdi = async(req, res) =>{
    const prodi = await Prodi.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!prodi) return res.status(404).json({msg: "Prodi tidak ditemukan"});
    const {nama, fakultas, uri} = req.body;
    try {
        await Prodi.update({
            nama: nama,
            fakultas: fakultas,
            uri: uri
        },{
            where:{
                id: prodi.id
            }
        });
        res.status(200).json({msg: "Prodi Updated"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const deleteProdi = async(req, res) =>{
    const prodi = await Prodi.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!prodi) return res.status(404).json({msg: "Prodi tidak ditemukan"});
    try {
        await Prodi.destroy({
            where:{
                id: prodi.id
            }
        });
        res.status(200).json({msg: "Prodi Deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}