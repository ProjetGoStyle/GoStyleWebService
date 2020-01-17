const SqliteHandler = require("../Dal/SqliteHandler");

class CodePromoController {
  sqliteHandler = null;
  dbPath = ""

  constructor(dbPath) {
    this.sqliteHandler = new SqliteHandler();
    this.dbPath = dbPath
  }

  async getCodePromoByQrCodeId(qrCodeId) {
    await this.sqliteHandler.open(this.dbPath);
    const queryToGetCodePromo = `SELECT promotion.code , promotion.description
                                          FROM qrcode 
                                          INNER JOIN promotion ON qrcode.promotionId = promotion.id
                                          WHERE qrcode.id = ?`;
    const result = await this.sqliteHandler.get(queryToGetCodePromo, Number(qrCodeId));
    await this.sqliteHandler.close();
    return result
  }

  async postCodePromo(objectCodePromo) {
    await this.sqliteHandler.open(this.dbPath);
    console.log(objectCodePromo);
    const query = `INSERT INTO promotion (code,description) VALUES(?,?)`;
    const stmt = await this.sqliteHandler.prepare(query);
    for (const codepromo of objectCodePromo) {
      stmt.run([codepromo.code, codepromo.description]);
    }
    stmt.finalize();
    //const result = await this.db.run(query)
    await this.sqliteHandler.close();
  }
}

module.exports = CodePromoController;