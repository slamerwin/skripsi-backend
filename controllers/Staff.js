import Staff from "../models/StaffModel.js";
import User from "../models/UserModel.js";
import Prodi from "../models/ProdiModel.js";
import Dosen from "../models/DosenModel.js";
import {Op} from "sequelize";

export const getStaff = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Staff.findAll({
                attributes:['uuid'],
                include:[{
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
        const staff = await Staff.findOne({
            where:{
                id_user: req.userId
            }
        });
        if(!staff) return res.status(404).json({msg: "Anda belum ditugaskan sebagai staff prodi"});
        const response = await Staff.findOne({
            attributes:['uuid'],
            where:{
                id: staff.id
            },
            include:[{
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

export const getStaffById = async(req, res) =>{
    try {
        const staff = await Staff.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!staff) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Staff.findOne({
                attributes:['uuid'],
                where:{
                    id: staff.id
                },
                include:[{
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

export const createStaff = async(req, res) =>{
    const {idprodi, iduser} = req.body;
    try {
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
        await Staff.create({
            id_prodi: prodi.id,
            id_user: user.id
        });
        res.status(201).json({msg: "Staff Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateStaff = async(req, res) =>{
    try {
        const staff = await Staff.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!staff) return res.status(404).json({msg: "Data staff tidak ditemukan"});
        const {idprodi, iduser} = req.body;
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
            await Staff.update({id_prodi: prodi.id, id_user: user.id},{
                where:{
                    id: staff.id
                }
            });
        }
        res.status(200).json({msg: "Staff updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteStaff = async(req, res) =>{
    try {
        const staff = await Staff.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!staff) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "admin"){
            await Staff.destroy({
                where:{
                    id: staff.id
                }
            });
        }else{
            if(req.userId !== staff.id_user) return res.status(403).json({msg: "Akses terlarang"});
            await Staff.destroy({
                where:{
                    [Op.and]:[{id: staff.id}, {id_user: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Staff deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}