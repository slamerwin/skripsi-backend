import Dosen from "../models/DosenModel.js";
import User from "../models/UserModel.js";
import Prodi from "../models/ProdiModel.js";
import {Op} from "sequelize";

export const getDosen = async (req, res) =>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Dosen.findAll({
                attributes:['uuid','nama','guna_nidn','nidn','nip'],
                include:[{
                    model: User,
                    attributes:['nama','email']
                },{
                    model: Prodi,
                    attributes:['nama','fakultas']
                }]
            });
        }else if(req.role === "Dosen"){
            response = await Dosen.findAll({
                attributes:['uuid','nama','guna_nidn','nidn','nip'],
                where:{
                    id_user: req.userId
                },
                include:[{
                    model: User,
                    attributes:['nama','email']
                },{
                    model: Prodi,
                    attributes:['nama','fakultas']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProdiDosen = async(req, res) =>{
    try {
        const dosen = await Dosen.findOne({
            where:{
                id_user: req.userId
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data tidak ditemukan"});
        const response = await Dosen.findOne({
            attributes:['uuid','nama','nidn','nip'],
            where:{
                id: dosen.id
            },
            include:[{
                model: Prodi,
                attributes:['uuid','nama','fakultas']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getDosenById = async(req, res) =>{
    try {
        const dosen = await Dosen.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Dosen.findOne({
                attributes:['uuid','nama','nidn','guna_nidn','nip'],
                where:{
                    id: dosen.id
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
            response = await Dosen.findOne({
                attributes:['uuid','nama','nidn','guna_nidn','nip'],
                where:{
                    [Op.and]:[{id: dosen.id}, {id_user: req.userId}]
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

export const getDosenByNama = async(req, res) =>{
    try {
        const response = await Dosen.findAll({
            attributes:['uuid','nama','nidn','guna_nidn','nip'],
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

export const getDosenByNamo = async(req, res) =>{
    try {
        const response = await Dosen.findAll({
            attributes:['uuid','nama','nidn','nip'],
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

export const createDosen = async(req, res) =>{
    const {nama, nidn, nip, idprodi, iduser} = req.body;
    try {
        const prodi = await Prodi.findOne({
            where:{
                uuid: idprodi
            }
        });
        if(!prodi) return res.status(404).json({msg: "Data prodi tidak ditemukan"});
        if(iduser !== undefined)
        {
            const user = await User.findOne({
                where:{
                    uuid: iduser
                }
            });
            if(!user) return res.status(404).json({msg: "Data user tidak ditemukan"});
            await Dosen.create({
                nama: nama,
                nidn: nidn,
                nip: nip,
                id_prodi: prodi.id,
                id_user: user.id
            });
        }else{
            await Dosen.create({
                nama: nama,
                nidn: nidn,
                nip: nip,
                id_prodi: prodi.id,
                id_user: req.userId
            });
        }
        res.status(201).json({msg: "Dosen Created Successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateDosen = async(req, res) =>{
    try {
        const dosen = await Dosen.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data dosen tidak ditemukan"});
        const {nama, nidn, gunanidn, nip, idprodi, iduser} = req.body;
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
            await Dosen.update({nama, nidn, guna_nidn:gunanidn, nip, id_prodi: prodi.id, id_user: user.id},{
                where:{
                    id: dosen.id
                }
            });
        }else{
            if(req.userId !== dosen.id_user) return res.status(403).json({msg: "Akses terlarang"});
            await Dosen.update({nama, nidn, nip, guna_nidn:gunanidn, id_prodi},{
                where:{
                    [Op.and]:[{id: dosen.id}, {id_user: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Dosen updated successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteDosen = async(req, res) =>{
    try {
        const dosen = await Dosen.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!dosen) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "admin"){
            await Dosen.destroy({
                where:{
                    id: dosen.id
                }
            });
        }else{
            if(req.userId !== dosen.id_user) return res.status(403).json({msg: "Akses terlarang"});
            await Dosen.destroy({
                where:{
                    [Op.and]:[{id: dosen.id}, {id_user: req.userId}]
                }
            });
        }
        res.status(200).json({msg: "Dosen deleted successfuly"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}