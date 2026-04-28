const { Router, json } = require("express");
const {
    createUsuarios,
    updateUsuarioCPF,
    findUsuarioById,
    updateUsuarioNome,
    updateUsuarioEmail,
    updateUsuarioSenha,
} = require("../repositories/usurio.repositories");

const router = Router();

router.post("/", async (req, res) => {
    const { nome, email, cpf, senha } = req.body;

    if (!nome || !email || !cpf || !senha) {
        return res.status(400).json({
            message: "Nome, email, cpf e senha são obrigatórios",
        });
    }

    if (senha.trim().length < 6) {
        return res.status(400).json({
            message: "Senha deve ter pelo menos 6 caracteres",
        });
    }

    try {
        const result = await createUsuarios(nome, email, cpf, senha);
        res.send(result);
    } catch (e) {
        if (e && e.code === "23505") {
            return res.status(409).json({
                message: "Já existe usuário com os dados informados",
            });
        }

        return res.status(500).json({
            message: "Erro interno no servidor",
        });
    }
});

router.patch("/:idUsuario/cpf", async function (req, res) {
    const idUsuario = getidUsuario(req.params);
    if (!idUsuario) {
        return res.status(400).json({ message: "idUsuario invalido" });
    }

    const { cpf } = req.body;
    if (!cpf) {
        return res.status(400).json({ message: "CPF obrigatorio" });
    }

    try {
        const result = await updateUsuarioCPF(idUsuario, cpf);
        if (!result) {
            return res.status(404).json({ message: "usuário não encontrado" });
        }

        const usuario = await findUsuarioById(result.id_usuario);
        return res.status(200).json(usuario);
    } catch (e) {
        if (e && e.code === "23505") {
            return res.status(409).json({
                message: "Já existe usuário com o CPF informado",
            });
        }

        return res.status(500).json({
            message: "Erro interno no servidor",
        });
    }
});

router.patch("/:idUsuario/nome", async function (req, res) {
    const idUsuario = getidUsuario(req.params);
    if (!idUsuario) {
        return res.status(400).json({ message: "idUsuario invalido" });
    }

    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ message: "nome obrigatorio" });
    }

    try {
        const result = await updateUsuarioNome(idUsuario, nome);
        if (!result) {
            return res.status(404).json({ message: "usuário não encontrado" });
        }

        const usuario = await findUsuarioById(result.id_usuario);
        return res.status(200).json(usuario);
    } catch (e) {
        return res.status(500).json({
            message: "Erro interno no servidor",
        });
    }
});

router.patch("/:idUsuario/email", async function (req, res) {
    const idUsuario = getidUsuario(req.params);
    if (!idUsuario) {
        return res.status(400).json({ message: "idUsuario invalido" });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "email obrigatorio" });
    }

    try {
        const result = await updateUsuarioEmail(idUsuario, email);
        if (!result) {
            return res.status(404).json({ message: "usuário não encontrado" });
        }

        const usuario = await findUsuarioById(result.id_usuario);
        return res.status(200).json(usuario);
    } catch (e) {
        if (e && e.code === "23505") {
            return res.status(409).json({
                message: "Já existe usuário com o email informado",
            });
        }

        return res.status(500).json({
            message: "Erro interno no servidor",
        });
    }
});

router.patch("/:idUsuario/senha", async function (req, res) {
    const idUsuario = getidUsuario(req.params);
    if (!idUsuario) {
        return res.status(400).json({ message: "idUsuario invalido" });
    }

    const { senha } = req.body;
    if (!senha) {
        return res.status(400).json({ message: "senha obrigatorio" });
    }
    if (senha.trim().length < 6) {
        return res.status(400).json({
            message: "Senha deve ter pelo menos 6 caracteres",
        });
    }

    try {
        const result = await updateUsuarioSenha(idUsuario, senha);
        if (!result) {
            return res.status(404).json({ message: "usuário não encontrado" });
        }

        const usuario = await findUsuarioById(result.id_usuario);
        return res.status(200).json(usuario);
    } catch (e) {
        if (e && e.code === "23505") {
            return res.status(409).json({
                message: "Já existe usuário com o senha informado",
            });
        }

        return res.status(500).json({
            message: "Erro interno no servidor",
        });
    }
});

function getidUsuario(params) {
    const idUsuario = Number(params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return null;
    }
    return idUsuario;
}

module.exports = router;

//  curl -X POST http://localhost:3000/api   -H "Content-Type: application/json"   -d '{"cpf":"56659497809","nome":"Pedro","email":"pedro@teste.com","senha":"123456"}'
