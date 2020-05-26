const cryptotools = require('./CryptoTools');
const Controller = require('./Controller');


class AuthController extends Controller{

    constructor(dbPath, sqliteHandler) {
        super(dbPath,sqliteHandler);
    }

    async login(login, password){
        if(!login) return null;
        if(!password) return null;
        const result = await this.getLoginExist(login);
        if(!result) return null;
        if(cryptotools.verify(password,result.password))
            return cryptotools.generateToken();
        else return null;
    }

    async insertAdmin({login,email,password}){
        return new Promise(async(resolve,reject) => {
            if (!login || !email || !password){
                reject("Tous les champs ne sont pas remplis");
                return;
            }
            const loginExist = await this.getLoginExist(login);
            if(loginExist){
                reject("Login déjà existant ..");
                return;
            }
            await this.sqliteHandler.open(this.dbPath);
            const queryToInsert = `INSERT INTO administrateur(login,email,password) VALUES(?,?,?)`;
            password = cryptotools.encrypt(password);
            try{
                const stmt = await this.sqliteHandler.prepare(queryToInsert);
                stmt.run([login,email,password]);
                stmt.finalize();
            }catch (e) {
                console.error(e);
                reject(e);
                return;
            }
            await this.sqliteHandler.close();
            resolve("Succès");
        });
    }

    async getLoginExist(login){
        await this.sqliteHandler.open(this.dbPath);
        const queryToGetAccess = `SELECT login, password
                                          FROM administrateur
                                          WHERE login = ?`;
        const result = await this.sqliteHandler.get(queryToGetAccess, login);
        await this.sqliteHandler.close();
        return result;
    }
}

module.exports = AuthController;