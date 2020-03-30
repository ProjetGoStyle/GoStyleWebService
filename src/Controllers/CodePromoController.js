
class CodePromoController {
  sqliteHandler = null;
  dbPath = "";

  constructor(dbPath, sqliteHandler) {
    this.sqliteHandler = sqliteHandler;
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

  async getCodesPromos(){
    await this.sqliteHandler.open(this.dbPath);
    const queryToGetAllCodesPromos = 'SELECT * FROM promotion';
    const result = await this.sqliteHandler.all(queryToGetAllCodesPromos);
    await this.sqliteHandler.close();
    return result;
  }

  async deleteCodePromo(codePromoId){
    return new Promise(async (resolve, reject) => {
      await this.sqliteHandler.open(this.dbPath);
      const queryToDeleteQrcode = 'DELETE FROM qrcode WHERE promotionId = ?';
      const queryToDeleteCodePromo = 'DELETE FROM promotion WHERE id = ?';
      const stmtQrCode = await this.sqliteHandler.prepare(queryToDeleteQrcode);
      const stmtCodePromo = await this.sqliteHandler.prepare(queryToDeleteCodePromo);

      try{
        stmtQrCode.run(codePromoId);
        stmtQrCode.finalize();

        stmtCodePromo.run(codePromoId);
        stmtCodePromo.finalize();
      }catch (e) {
        reject(e);
        return;
      }
      await this.sqliteHandler.close();
      resolve('succès');
    });
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