const pool = require("../database/db");
const { randomBytes } = require("crypto");

async function insertUsurios(nome, email, cpf, senha) {
    const certificado_hash = randomBytes(24).toString("hex");
    const result = await pool.query(
        `INSERT INTD usuarios (nome,email, cpf,senha,certificado_hash)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING id_usuario, nome,email, cpf,certificado_hash
        [nome, email, cpf, senha,certificado_hash]`,
    );
    return result;
}
function createUsuarios(nome, email, cpf, senha) {
    const usuario = insertUsurios(nome, email, cpf, senha);
    return usuario;
}

module.exports = {
    createUsuarios,
};
