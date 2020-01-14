import { resolve } from "dns";
import { DatabaseHandler } from "./dal/DatabaseHandler";

const express = require("express");
const QrCode = require("qrcode");
const app = express();

require("dotenv").config();

const dbHandler = DatabaseHandler.getInstance(process.env.DBPATH);

app.get("/createqrcode", (req: any, res: any) => {});

app.listen(process.env.PORT);
