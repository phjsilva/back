const { Result } = require("pg");
const pool = require("../database/db");
const { randomBytes } = require("crypto");
const { error } = require("console");

async function insertUsuarios(client, nome, email, cpf, senha) {
    const certificado_hash = randomBytes(24).toString("hex");

    try {
        const result = await client.query(
            `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id_usuario, nome, email, cpf, certificado_hash`,
            [nome, email, cpf, senha, certificado_hash],
        );

        if (result.rowCount === 1) {
            return result.rows[0];
        }

        return null;
    } catch (e) {
        console.error("Erro ao inserir usuário:", e);
        throw e;
    }
}

async function findPrimeiroModulo(client) {
    const result = await client.query(
        `SELECT id_modulo FROM modulos ORDER BY id_modulo LIMIT 1`,
    );

    if (result.rows.length === 1) {
        return result.rows[0];
    }

    return null;
}

async function findGrupoAleatorio(client, idModulo) {
    const result = await client.query(
        `SELECT grupo
         FROM questoes
         WHERE id_modulo = $1 AND grupo IS NOT NULL
         ORDER BY RANDOM()
         LIMIT 1`,
        [idModulo],
    );

    if (result.rows.length === 1) {
        return result.rows[0];
    }

    return null;
}

async function insertExame(client, idModulo, idUsuario, grupo, tentativa) {
    const result = await client.query(
        `INSERT INTO exames (id_modulo, id_usuario, grupo, tentativa)
         VALUES ($1, $2, $3, $4)
         RETURNING id_exame`,
        [idModulo, idUsuario, grupo, tentativa],
    );

    return result.rows[0] || null;
}

async function createUsuarios(nome, email, cpf, senha) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const usuario = await insertUsuarios(client, nome, email, cpf, senha);

        if (!usuario) {
            await client.query("ROLLBACK");
            return { error: "Problemas ao criar o usuário" };
        }

        const modulo = await findPrimeiroModulo(client);
        if (!modulo) {
            throw new Error("Nenhum módulo cadastrado");
        }

        const grupo = await findGrupoAleatorio(client, modulo.id_modulo);
        if (!grupo) {
            throw new Error("Nenhum grupo cadastrado");
        }

        const exame = await insertExame(
            client,
            modulo.id_modulo,
            usuario.id_usuario,
            grupo.grupo,
            1,
        );

        if (!exame) {
            throw new Error("Erro ao criar exame");
        }

        await client.query("COMMIT");

        return {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            cpf: usuario.cpf,
        };
    } catch (e) {
        await client.query("ROLLBACK");
        console.error("Erro na transação:", e);
        throw e;
    } finally {
        client.release();
    }
}

module.exports = {
    createUsuarios,
};
