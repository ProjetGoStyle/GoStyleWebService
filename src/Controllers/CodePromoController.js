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

  postCodePromo(codepromo) {
    return new Promise(async (resolve, reject) => {
      await this.sqliteHandler.open(this.dbPath);
      const query = `INSERT INTO promotion (code,description) VALUES(?,?)`;
      let isRejected = false;
      const stmt = await this.sqliteHandler.prepare(query);
      const codeExist = await this.sqliteHandler.get('SELECT * FROM promotion WHERE code = ?', codepromo.code);
      if (!codeExist)
        stmt.run([codepromo.code, codepromo.description]);
      else
        isRejected = true;

      stmt.finalize();
      await this.sqliteHandler.close();
      if (isRejected) {
        reject("Code promotion existant");
        return;
      }
      resolve("Succès");
    })
  }
}

module.exports = CodePromoController;