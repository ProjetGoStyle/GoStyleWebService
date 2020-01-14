import sqlite from "sqlite";
import { IDatabase } from "./Interfaces/IDatabase";

export class DatabaseHandler implements IDatabase {
  private dbPath: string = null;
  private connectionOptions: Object = null;
  private static databaseHandler: DatabaseHandler;

  private constructor(dbPath: string) {
    this.dbPath = dbPath;
    this.connectionOptions = {
      Promise
    };
  }

  public static getInstance(dbPath: string) {
    DatabaseHandler.databaseHandler === null
      ? new DatabaseHandler(dbPath)
      : DatabaseHandler.databaseHandler;
    return DatabaseHandler.databaseHandler;
  }

  async connect(): Promise<sqlite.Database> {
    return await sqlite.open(this.dbPath, this.connectionOptions);
  }
}
