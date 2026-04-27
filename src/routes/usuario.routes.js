const { Router, json } = require("express");
const { createUsuarios } = require("../repositories/usurio.repositories");
const router = Router();

router.post("/", async (req, res) => {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !email || !cpf || !senha) {
        return res.status(400).json({
            message: "Nome, email, cpf e senha são obrigatórios",
        });
    }

    try {
        const result = await createUsuarios(nome, email, cpf, senha);
        return res.status(201).json(result);
    } catch (e) {
        console.error("Erro na rota:", e);

        if (e.code === "23505") {
            return res.status(409).json({
                message: "Já existe usuário com os dados informados",
            });
        }

        return res.status(500).json({
            message: "Erro interno no servidor",
        });
    }
});

module.exports = router;

//  curl -X POST http://localhost:3000/api   -H "Content-Type: application/json"   -d '{"cpf":"56659497809","nome":"Pedro","email":"pedro@teste.com","senha":"123456"}'
