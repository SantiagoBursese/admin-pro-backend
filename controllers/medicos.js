const { response } = require('express')
const Medico = require('../models/medico')

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find().populate('usuario', 'nombre img').populate('hospital', 'nombre img');
    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async(req, res = response) => {

    const uid = req.uid
    const hospital = req.hospital
    const medico = new Medico({
        usuario: uid,
        hospital: hospital,
        ...req.body
    })

    try {

        const medicoDB = await medico.save()
        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }


}

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id
    const uid = req.uid

    try {

        const medico = await Medico.findById(id)

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true })

        res.json({
            ok: true,
            msg: 'medico actualizado',
            medico: medicoActualizado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const borrarMedico = async(req, res = response) => {

    const id = req.params.id

    try {

        const medico = await Medico.findById(id)

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            })
        }

        await Medico.findByIdAndRemove(id)

        res.json({
            ok: true,
            msg: 'medico eliminado'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const getMedicoById = async(req, res = response) => {

    const id = req.params.id
    try {
        const medico = await Medico.findById(id).populate('usuario', 'nombre img').populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medico
        })

    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}