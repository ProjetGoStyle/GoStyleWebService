import { resolve } from "dns";
import { DatabaseHandler } from "./dal/DatabaseHandler";
import { IDatabase } from "./dal/Interfaces/IDatabase";

require("dotenv").config();

const express = require("express");
const QrCode = require("qrcode");
const app = express();

export const dbHandler = DatabaseHandler.getInstance(process.env.DBPATH);

app.get("/createqrcode", (req: any, res: any) => {});

app.listen(process.env.PORT);
