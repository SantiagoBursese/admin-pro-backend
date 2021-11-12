const { response } = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFontEnd } = require('../helpers/menu-frontend');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password)

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'pass no valida'
            })
        }

        //GENERAR TOKEN -JWT
        const token = await generarJWT(usuarioDB.id)

        res.json({
            ok: true,
            token,
            menu: getMenuFontEnd(usuarioDB.role)
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const googleSignIn = async(req, res = response) => {
    const googleToken = req.body.token

    try {

        const { name, email, picture } = await googleVerify(googleToken)

        const usuarioDB = await Usuario.findOne({ email })
        let usuario

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB
            usuario.google = true
        }

        await usuario.save()

        const token = await generarJWT(usuario.id)


        res.json({
            ok: true,
            token,
            menu: getMenuFontEnd(usuario.role)
        })

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Tokem no es correcto'
        })

    }
}

const renewToken = async(req, res = response) => {

    const uid = req.uid
        //GENERAR TOKEN -JWT
    const token = await generarJWT(uid)

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
        return res.status(404).json({
            ok: false,
            msg: 'No existe un usuario por ese id'
        })
    }


    res.json({
        ok: true,
        token,
        usuarioDB,
        menu: getMenuFontEnd(usuarioDB.role)
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}