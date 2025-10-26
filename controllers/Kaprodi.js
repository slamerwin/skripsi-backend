import Kapro from "../models/KaprodiModel.js";
import User from "../models/UserModel.js";
import Prodi from "../models/ProdiModel.js";
import Dosen from "../models/DosenModel.js";
import {Op} from "sequelize";

export const getKaprodi = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Kapro.findAll({
                attributes:['uuid'],
                include:[{
                    model: Dosen,
                    attributes:['uuid','nama','nip']
                },{
                    model: User,
                    attributes:['uuid','nama','email']
                },{
                    model: Prodi,
                    attributes:['uuid','nama','fakultas']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProdi = async(req, res) =>{
    try {
        const kapro = await Kapro.findOne({
            where:{
                id_user: req.userId
            }
        });
        if(!kapro) return res.status(404).json({msg: "Anda belum ditugaskan sebagai ka. prodi"});
        const response = await Kapro.findOne({
            attributes:['uuid'],
            where:{
                id: kapro.id
            },
            include:[{
                model: Dosen,
                attributes:['uuid','nama','nip']
            },{
                model: User,
                attributes:['uuid','nama','email']
            },{
                model: Prodi,
                attributes:['uuid','nama','fakultas']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getKaprodiById = async(req, res) =>{
    try {
        const kapro = await Kapro.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!kapro) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Kapro.findOne({
                attributes:['uuid'],
                where:{
                    id: kapro.id
                },
                include:[{
                    model: Dosen,
                    attributes:['uuid','nama','nip']
                },{
                    model: User,
                    attributes:['uuid','nama','email']
                },{
                    model: Prodi,
                    attributes:['uuid','nama','fakultas']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createKaprodi = async(req, res) =>{
    const {iddosen, idprodi, iduser} = req.body;
    try {
        const dosen = await Dosen.findOne({
            where:{
                uuid: iddosen
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        const user = await User.findOne({
            where:{
                uuid: iduser
            }
        });
        if(!user) return res.status(404).json({msg: "Data user tidak ditemukan"});
        await Kapro.create({
            id_dosen: dosen.id,
            id_prodi: prodi.id,
            id_user: user.id
        });
        res.status(201).json({msg: "Kaprodi Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateKaprodi = async(req, res) =>{
    try {
        const kapro = await Kapro.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!kapro) return res.status(404).json({msg: "Data kaprodi tidak ditemukan"});
        const {iddosen, idprodi, iduser} = req.body;
        const dosen = await Dosen.findOne({
            where:{
                uuid: iddosen
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        const user = await User.findOne({
            where:{
                uuid: iduser
            }
        });
        if(!user) return res.status(404).json({msg: "Data user tidak ditemukan"});
        if(req.role === "admin"){
            await Kapro.update({id_dosen:dosen.id, id_prodi: prodi.id, id_user: user.id},{
                where:{
                    id: kapro.id
                }
            });
        }
        res.status(200).json({msg: "Kaprodi updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteKaprodi = async(req, res) =>{
    try {
        const kapro = await Kapro.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!kapro) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "admin"){
            await Kapro.destroy({
                where:{
                    id: kapro.id
                }
            });
        }else{
            if(req.userId !== kapro.id_user) return res.status(403).json({msg: "Akses terlarang"});
            await Kapro.destroy({
                where:{
                    [Op.and]:[{id: kapro.id}, {id_user: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Kaprodi deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}