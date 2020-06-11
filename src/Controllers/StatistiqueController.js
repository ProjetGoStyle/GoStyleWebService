const Controller = require('./Controller');

class StatistiqueController extends Controller{

    constructor(dbPath, sqliteHandler) {
        super(dbPath,sqliteHandler);
    }

    convertToString(date){
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

        return `${ye}-${mo}-${da}`;
    }

    getStartWeek(date){
        const dateNow = date;
        const dayOfWeek = dateNow.getDay() - 1;
        dateNow.setDate(dateNow.getDate() - dayOfWeek);
        return dateNow;
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
                stmt.run([qrCodeId, this.convertToString(new Date())])
                stmt.finalize();
                resolve();
            }catch (e) {
                console.error(e);
                reject(e)
            }finally {
                await this.sqliteHandler.close();
            }
        });
    }

    async countUtilisationByCodePromo(){
        return new Promise(async(resolve,reject) => {
            await this.sqliteHandler.open(this.dbPath);
            const queryToCountUtilisationByCodePromo = `select promotion.code as "code" ,count(utilisation.id) as "countUse"
                                                    from promotion
                                                    inner join utilisation on utilisation.promotionId = promotion.id
                                                    group by promotion.id`;
            let result;
            try{
                result = await this.sqliteHandler.all(queryToCountUtilisationByCodePromo);
                resolve(result);
            }catch (e) {
                console.error(e);
                reject(e);
            }finally {
                await this.sqliteHandler.close();
            }
        });
    }

    /**
     *
     * @param previousWeek : boolean
     * @returns {Promise<unknown>}
     */
    async avgUtilisationForWeek(previousWeek){
        return new Promise(async(resolve,reject) => {
            await this.sqliteHandler.open(this.dbPath);
            const queryAvgUtilisationByDay = `select avg("nombreUtilisation") as "avgUse"
                                            from (select promotion.id as "promotionId",count(utilisation.id) as "nombreUtilisation"
                                            from promotion
                                            inner join utilisation on utilisation.promotionId = promotion.id
                                            where utilisation.dateUtilisation between ? and ?
                                            group by "promotionId")`;
            let result, params;
            try{
                const startDate = this.getStartWeek(new Date());
                if(previousWeek === true){
                    const startDatePrevious = new Date();
                    startDatePrevious.setDate(startDate.getDate() - 7);
                    startDate.setDate(startDate.getDate() - 1);
                    params = [this.convertToString(startDatePrevious),this.convertToString(startDate)];
                }else
                    params = [this.convertToString(startDate),this.convertToString(new Date())];
                result = await this.sqliteHandler.all(queryAvgUtilisationByDay, params);
                resolve(result);
            }catch (e) {
                console.error(e);
                reject(e);
            }finally {
                await this.sqliteHandler.close();
            }
        });
    }
}

module.exports = StatistiqueController;