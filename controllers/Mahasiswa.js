import Mahasiswa from "../models/MahasiswaModel.js";
import User from "../models/UserModel.js";
import Prodi from "../models/ProdiModel.js";
import {Op} from "sequelize";

export const getMahasiswa = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Mahasiswa.findAll({
                attributes:['uuid','nim','nama', 'nomor_handphone'],
                include:[{
                    model: User,
                    attributes:['uuid','nama','email']
                },{
                    model: Prodi,
                    attributes:['uuid','nama','fakultas']
                }]
            });
        }else{
            response = await Mahasiswa.findOne({
                attributes:['uuid','nim','nama', 'nomor_handphone'],
                where:{
                    id_user: req.userId
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

export const getMahasiswaById = async(req, res) =>{
    try {
        const mahasiswa = await Mahasiswa.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!mahasiswa) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Mahasiswa.findOne({
                attributes:['uuid','nim','nama'],
                where:{
                    id: mahasiswa.id
                },
                include:[{
                    model: User,
                    attributes:['uuid','nama','email']
                },{
                    model: Prodi,
                    attributes:['uuid','nama','fakultas']
                }]
            });
        }else{
            response = await Mahasiswa.findOne({
                attributes:['uuid','nim','nama'],
                where:{
                    [Op.and]:[{id: mahasiswa.id}, {userId: req.userId}]
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

export const getMahasiswaByNama = async(req, res) =>{
    try {
        const response = await Mahasiswa.findAll({
            attributes:['uuid','nim','nama'],
            where:{
                nama: {
                    [Op.like]: '%'+req.params.nama+'%'
                }
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

export const getMahasiswaByNamo = async(req, res) =>{
    try {
        const response = await Mahasiswa.findAll({
            attributes:['uuid','nim','nama'],
            where:{
                nama: {
                    [Op.like]: '00%'
                }
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

export const createMahasiswa = async(req, res) =>{
    const {nim, nama, handphone, idprodi} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        await Mahasiswa.create({
            nim: nim,
            nama: nama,
            nomor_handphone: handphone,
            id_prodi: prodi.id,
            id_user: req.userId
        });
        res.status(201).json({msg: "Mahasiswa Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateMahasiswa = async(req, res) =>{
    try {
        const mahasiswa = await Mahasiswa.findOne({
            where:{
                uuid: req.params.id
            }
        });
        const {nim, nama, idprodi, iduser} = req.body;
        if(!mahasiswa) return res.status(404).json({msg: "Data mahasiswa tidak ditemukan"});
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
            await Mahasiswa.update({nim, nama, id_prodi: prodi.id, id_user: user.id},{
                where:{
                    id: mahasiswa.id
                }
            });
        }else{
            if(req.userId !== mahasiswa.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Mahasiswa.update({nim, nama, nomor_handphone:handphone, id_prodi: prodi.id},{
                where:{
                    [Op.and]:[{id: mahasiswa.id}, {id_user: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Mahasiswa updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateCreateMahasiswa = async(req, res) =>{
    try {
        const {nim, nama, idprodi, handphone} = req.body;
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        const mahasiswa = await Mahasiswa.findOne({
            where:{
                id_user: req.userId
            }
        });
        if(!mahasiswa)
        {
            await Mahasiswa.create({
                nim: nim,
                nama: nama,
                nomor_handphone: handphone,
                id_prodi: prodi.id,
                id_user: req.userId
            });
            res.status(200).json({msg: "Mahasiswa Created Successfuly"});
        }else{
            await Mahasiswa.update({nim, nama, nomor_handphone: handphone, id_prodi: prodi.id},{
                where:{
                    id_user: req.userId
                }
            });
            res.status(200).json({msg: "Mahasiswa updated successfuly"});
        }
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteMahasiswa = async(req, res) =>{
    try {
        const mahasiswa = await Mahasiswa.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!mahasiswa) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "admin"){
            await Mahasiswa.destroy({
                where:{
                    id: mahasiswa.id
                }
            });
        }else{
            if(req.userId !== mahasiswa.id_user) return res.status(403).json({msg: "Akses terlarang"});
            await Mahasiswa.destroy({
                where:{
                    [Op.and]:[{id: mahasiswa.id}, {id_user: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Mahasiswa deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}