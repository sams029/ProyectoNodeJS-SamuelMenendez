'use strict'

const { validationResult } = require('express-validator');

var Maestros = require('../models/maestros');

var controller = {
    maestros: function(req, res){
        
        Maestros.find({}).exec( (err, maestros) =>{
            if(err) return res.status(500).json({status: 500,mensaje: err});
            if(!maestros) return res.status(200).json({status: 200,mensaje: "No hay maestros por listar."});

            return res.status(200).json({
                status: 200,
                data: maestros
            });

        });

    },

    maestro: function(req, res){
        
        let id_maestro = req.params.id_maestro;

        Maestros.findOne({id_maestro: id_maestro}).exec( (err, maestro) =>{
            if(err) return res.status(500).json({status: 500,mensaje: err});
            if(!maestro) return res.status(200).json({status: 200,mensaje: "No se encontro el maestro."});

            return res.status(200).json({
                status: 200,
                data: maestro
            });

        });

    },

    crear_maestro: function(req, res){

        //Validamos los datos que se envian al endpoint
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        let user_info = req.body;


        Maestros.findOne({id_maestro: user_info.id_maestro}).exec( (err, maestro) =>{
            if(err) return res.status(500).json({status: 500,mensaje: err});
            if(maestro) return res.status(200).json({status: 200,mensaje: "El id de maestro ya existe."});
        
            let maestros_model = new Maestros();

            maestros_model.id_maestro = user_info.id_maestro;
            maestros_model.nombre = user_info.nombre;
            maestros_model.apellido = user_info.apellido;
            maestros_model.edad = user_info.edad;
            maestros_model.genero = user_info.genero;
            maestros_model.especialidad = user_info.especialidad;

            maestros_model.save((err, maestroStored) => {
                if(err) return res.status(500).json({status: 500,mensaje: err});
                if(!maestroStored) return res.status(200).json({status: 200,mensaje: "No se logro almancenar el maestro."});
            });

            return res.status(200).json({
                status: 200,
                menssage: "Maestro almacenado." 
            });
        
        });

    },

    update_maestro: function(req, res) {
        //Validamos los datos que se envian al endpoint
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        let id_maestro = req.params.id_maestro;
        let user_info = req.body;

        let maestro_info_update = {
            nombre: user_info.nombre,
            apellido: user_info.apellido, 
            edad: user_info.edad, 
            genero: user_info.genero,
            especialidad: user_info.especialidad
        };

        Maestros.findOneAndUpdate({id_maestro: id_maestro}, maestro_info_update, {new:true}, (err, maestroUpdate) => {
            if(err) return res.status(500).json({message: 'Error al actualizar.'});
            if(!maestroUpdate) return res.status(404).json({message: 'No existe el maestro.'});


            console.log(maestroUpdate);

            return res.status(200).json({
                nombre: maestroUpdate.nombre,
                apellido: maestroUpdate.apellido, 
                edad: maestroUpdate.edad, 
                genero: maestroUpdate.genero, 
                especialidad: maestroUpdate.especialidad
            });


        });

        
        
    },

    
    delete_maestro: function(req, res) {

        //Validamos los datos que se envian al endpoint
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        let id_maestro = req.params.id_maestro;

        Maestros.findOneAndRemove({id_maestro: id_maestro}, (err, maestroDelete) => {
            if(err) return res.status(500).json({message: 'Error al eliminar.'});
            if(!maestroDelete) return res.status(404).json({message: 'No existe el maestro.'});

            return res.status(200).json({
                message: "Mastro eliminado."
            });

        });

    }
};
module.exports = controller;