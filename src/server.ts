const DatabaseHandler = require("./dal/DatabaseHandler");

require("dotenv").config();

const express = require("express");
const app = express();

app.get("/coupon/:id", async (req: any, res: any) => {
  const dbclient = new DatabaseHandler(process.env.DBPATH);
  res.append("Content-Type", "application/json");
  dbclient.getCodePromoByQrCodeId(req.params.id,
    (row: any) => {
      res.send({ codepromo: row.code });
    }, (error: any) => {
      res.status(500).send({ erreur: error });
    });
  dbclient.close();
});

app.listen(process.env.PORT);
