const SqliteHandler = require("../Dal/SqliteHandler");

class DatabaseHandler {
  dbclient = null;
  dbPath = ""

  constructor(dbPath) {
    this.dbclient = new SqliteHandler();
    this.dbPath = dbPath
  }

  async getCodePromoByQrCodeId(qrCodeId) {
    const lol = await this.dbclient.open(this.dbPath);
    const queryToGetCodePromo = `SELECT promotion.code
                                          FROM qrcode 
                                          INNER JOIN promotion ON qrcode.promotionId = promotion.id
                                          WHERE qrcode.id = ?`;
    const result = await this.dbclient.get(queryToGetCodePromo, Number(qrCodeId));
    await this.dbclient.close();
    return result
  }

  getAll() {

  }
}

module.exports = DatabaseHandler;