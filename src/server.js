const express = require("express");
require("dotenv").config({
    quiet: true,
});
const path = require("path");
const router = require("./routes/usuario.routes");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

app.use(express.static(pagesPath));
app.use("/assets", express.static(assetsPath));
app.use("/api", router);

app.use(function (req, res) {
    res.redirect("/not-found.html");
});
app.listen(PORT, function () {
    console.log(`http://localhost:${PORT}`);
});
