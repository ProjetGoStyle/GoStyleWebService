const Controller = require('./Controller');
const  StatistiqueController = require('./StatistiqueController');


class CodePromoController extends Controller{

    statistiqueController;
    constructor(dbPath, sqliteHandler) {
        super(dbPath,sqliteHandler);
        this.statistiqueController = new StatistiqueController(dbPath, sqliteHandler);
    }

  async getCodePromoByQrCodeId(qrCodeId) {
    await this.sqliteHandler.open(this.dbPath);
    const queryToGetCodePromo = `SELECT promotion.code , promotion.description
                                          FROM qrcode 
                                          INNER JOIN promotion ON qrcode.promotionId = promotion.id
                                          WHERE qrcode.id = ?`;
    const result = await this.sqliteHandler.get(queryToGetCodePromo, Number(qrCodeId));
    await this.sqliteHandler.close();
      if(result){
          try{
              await this.statistiqueController.insertUtilisation(qrCodeId);
          }catch (e) {
              console.error(e);
          }
      }
    return result
  }

  async getCodesPromos(){
    await this.sqliteHandler.open(this.dbPath);
    const queryToGetAllCodesPromos = 'SELECT * FROM promotion';
    const result = await this.sqliteHandler.all(queryToGetAllCodesPromos);
    await this.sqliteHandler.close();
    return result;
  }

  async updateCodePromo({code,description,id}){
      return new Promise(async (resolve,reject) => {
          if(!code || !id){
              reject("Le code promotionnel et/ou l'id est vide ..");
              return;
          }
          await this.sqliteHandler.open(this.dbPath);
          const codeExist = await this.sqliteHandler.get('SELECT * FROM promotion WHERE code = ? AND id != ?', [code,id]);
          if(codeExist){
              reject("Le code promo existe déjà");
              return;
          }
          const queryToUpdateCodePromo = "UPDATE promotion SET code = ?, description = ?  WHERE id = ?";
          try{
              const stmtUpdate = await this.sqliteHandler.prepare(queryToUpdateCodePromo);
              stmtUpdate.run([code,description, id]);
              stmtUpdate.finalize();
          }catch (e) {
              console.log(e);
              reject(e);
          }finally {
              await this.sqliteHandler.close();
          }
          resolve();
      });
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
        console.log(e);
        reject(e);
      }finally {
          await this.sqliteHandler.close();
      }
      resolve('succès');
    });
  }

  async postCodePromo(codepromo) {
    return new Promise(async (resolve, reject) => {
      if(!codepromo.code){
        reject("Le champ code promo est vide ..");
        return;
      }
      await this.sqliteHandler.open(this.dbPath);
      const queryPromo = `INSERT INTO promotion (code,description) VALUES(?,?)`;
      const queryQrcode = `INSERT INTO qrcode (promotionId) VALUES(?)`;
      let isRejected = false;
      let newcodepromo;
      const stmt = await this.sqliteHandler.prepare(queryPromo);
      const stmt2 = await this.sqliteHandler.prepare(queryQrcode);
      const codeExist = await this.sqliteHandler.get('SELECT * FROM promotion WHERE code = ?', codepromo.code);
      if (!codeExist){
        stmt.run([codepromo.code, codepromo.description]);
        newcodepromo = await this.sqliteHandler.get('SELECT * FROM promotion WHERE code = ?', codepromo.code);
        stmt2.run(newcodepromo.id);
      }
      else
        isRejected = true;

      stmt.finalize();
      stmt2.finalize();
      await this.sqliteHandler.close();
      if (isRejected) {
        reject("Code promotion existant");
        return;
      }
      resolve(newcodepromo);
    })
  }
}

module.exports = CodePromoController;