const { Router, json } = require("express");
const {
    findUsuarioByCpfAndSenha,
} = require("../repositories/usuario.repositories");
const { createToken } = require("../utils/jwt");
const router = Router();

router.post("/login", async function (req, res) {
    const { cpf, senha } = req.body;

    if (!cpf || !senha) {
        return res
            .status(400)
            .json({ message: "CPF e senha são obrigatorios" });
    }

    try {
        const usuario = await findUsuarioByCpfAndSenha(cpf, senha);
        const token = createToken({ id_usuario: usuario.id_usuario });
        return res.status(200).json({
            token,
            nome: usuario.nome,
        });
    } catch (e) {
        return res.status(401).json({ message: "CPF ou senha inválidos" });
    }
});
module.exports = router;
