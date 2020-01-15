const sqlite3 = require("sqlite3").verbose();

export class DatabaseHandler {
  private static databaseHandler: DatabaseHandler;
  private dbclient: any = null;

  constructor(dbPath: string) {
    this.dbclient = new sqlite3.Database(dbPath);
  }

  public getCodePromoByQrCodeId(qrCodeId: string, callbackSuccess: Function, callbackError: Function): void {
    if (!qrCodeId) {
      callbackError(null);
      return;
    }
    const queryToGetCodePromo: string = `SELECT promotion.code
                                          FROM qrcode 
                                          INNER JOIN promotion ON qrcode.promotionId = promotion.id
                                          WHERE qrcode.id = ?`;
    this.dbclient.serialize(() => {
      this.dbclient.get(queryToGetCodePromo, Number(qrCodeId), (err: any, row: any) => {
        if (row) callbackSuccess(row);
        else callbackError(err);
      });
    });
  }

  public getAll() {

  }

  public insert(query: string) {
    this.dbclient.serialize(() => {
      this.dbclient.run(query, (error: any) => {
        console.log(error);
      }
      );
    });
  }

  public close() {
    this.dbclient.close();
  }
}
