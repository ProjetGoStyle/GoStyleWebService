require("dotenv").config();
const DatabaseController = require('./Controllers/DatabaseController')
const express = require("express");
const url = '/api';
const app = express();
//const dbclient = new DatabaseHandler(process.env.DBPATH);
const dbclient = new DatabaseController(process.env.DBPATH);



app.get(url + "/coupon/:id", async (req, res) => {
  res.append("Content-Type", "application/json");
  dbclient.getCodePromoByQrCodeId(req.params.id)
    .then((result) => {
      res.send({ codepromo: result.code });
    }).catch((erreur) => {
      res.status(500).send({ erreur: "Not Found" });
    });
});

app.listen(process.env.MY_PORT);
