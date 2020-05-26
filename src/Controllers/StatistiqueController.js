const Controller = require('./Controller');

class StatistiqueController extends Controller{

    constructor(dbPath, sqliteHandler) {
        super(dbPath,sqliteHandler);
    }

    async insertUtilisation(qrCodeId){
        return new Promise(async(resolve,reject) => {
            if(!qrCodeId){
                reject("l'identifiant est vide..");
            }
            await this.sqliteHandler.open(this.dbPath);
            const queryToInsertUtilisation = `insert into utilisation ("promotionId", "dateUtilisation") 
                                          values (
                                                    (select promotion.id 
                                                    from promotion 
                                                    inner join qrcode on qrcode.promotionId = promotion.id 
                                                    where qrcode.id = ?),
                                                    ?
                                                  )`;
            const stmt = await this.sqliteHandler.prepare(queryToInsertUtilisation);
            try{
                stmt.run([qrCodeId, new Date()])
                stmt.finalize();
            }catch (e) {
                console.error(e);
                reject(e)
                return;
            }
            await this.sqliteHandler.close();
            resolve();
        });
    }

    async countUtilisationByCodePromo(){
        const queryToCountUtilisationByCodePromo = `select count(utilisation.id)
                                                    from promotion
                                                    inner join utilisation on utilisation.promotionId = promotion.id
                                                    group by promotion.id`;
    }

    async avgUtilisationByDay(){
        const queryAvgUtilisationByDay = `select (promotion.id) 
                                          from promotion 
                                          inner join utilisation 
                                          on utilisation.promotionId = promotion.id 
                                          where utilisation.dateUtilisation `;
        const query = `select count(utilisation.id)
                        from promotion
                        inner join utilisation on utilisation.promotionId = promotion.id
                        where date(utilisation.dateUtilisation) between date(utilisation.dateUtilisation) and DATE(date(utilisation.dateUtilisation),'-7 day')
                        group by date(utilisation.dateUtilisation)`;
    }
}

module.exports = StatistiqueController;