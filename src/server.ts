import { resolve } from "dns";

const express = require("express");
const QrCode = require("qrcode");

require("dotenv").config();

const app = express();

app.get("/createqrcode", (req: any, res: any) => {
  /*res.append("Content-Type", "application/json");
  QrCode.toFile(
    "./filename.png",
    "Je suis un redondindron",
    {
      color: {
        dark: "#00F", // Blue dots
        light: "#0000" // Transparent background
      }
    },
    (err: any) => {
      if (err) throw err;
      console.log("done");
    }
  );*/
});

app.listen(process.env.PORT);
