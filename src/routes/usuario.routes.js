const { Router } = require("express");
const { createUsuarios } = require("../repositories/usurio.repositories");
const router = Router();

router.post("/", function (req, res) {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !cpf || !email || !senha) {
        return res
            .status(400)
            .json({ message: "Nome , email, cpf e senha são obrigatórios" });
    }
    const result = createUsuarios(nome, email, cpf, senha);
    res.send(result);
});
module.exports = router;

//  curl -X POST http://localhost:3000/api   -H "Content-Type: application/json"   -d '{"cpf":"56659497809","nome":"Pedro","email":"pedro@teste.com","senha":"123456"}'
