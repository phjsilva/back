const { Router, json } = require("express");
const usuario = require("./usuario.routes");
const auth = require("./auth.routes");

const router = Router();

router.use("/usuarios", usuario);
router.use("/auth", auth);

router.use(function (req, res) {
    res.status(404).json({ message: "Rota inexistente" });
});
router;
module.exports = router;
