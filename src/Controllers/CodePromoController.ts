import { IDatabase } from "../dal/Interfaces/IDatabase";
import { DatabaseHandler } from "../dal/DatabaseHandler";
import { dbHandler } from "../server";
import sqlite from "sqlite";

class CodePromoController {
  private dbHandler: IDatabase = null;
  private dbClient: Promise<sqlite.Database> = null;

  constructor() {
    this.dbHandler = dbHandler;
    this.dbClient = this.dbHandler.connect();
  }

  public getCodePromoByQrCodeId(idQrCode: string): string {
    this.dbClient;
  }
}
