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
            const queryToInsertAdmin = `INSERT INTO administrateur(login,email,password) VALUES(?,?,?)`;
            password = cryptotools.encrypt(password);
            try{
                const stmt = await this.sqliteHandler.prepare(queryToInsertAdmin);
                stmt.run([login,email,password]);
                stmt.finalize();
            }catch (e) {
                console.error(e);
                reject(e);
            }finally {
                await this.sqliteHandler.close();
            }
            const newAdmin = await this.getLoginExist(login);
            resolve(newAdmin);
        });
    }

    async getAdmins(){
        return new Promise(async(resolve,reject)=> {
            await this.sqliteHandler.open(this.dbPath);
            const queryToGetAllAdmins = 'SELECT id,email,login FROM administrateur';
            let result;
            try{
                result = await this.sqliteHandler.all(queryToGetAllAdmins);
            }catch (e) {
                console.error(e);
                reject(e);
            }finally {
                await this.sqliteHandler.close();
            }
            resolve(result);
        });

    }

    async updateAdmin({id,login,email, password}){
        return new Promise(async (resolve,reject) => {
            if (!id || !login || !email){
                reject("Login ou/et email vides ..");
                return;
            }
            await this.sqliteHandler.open(this.dbPath);
            const loginExist = await this.sqliteHandler.get('SELECT * FROM administrateur WHERE login = ? AND id != ?', [login,id]);
            if(loginExist){
                reject("Login déjà existant ..");
                return;
            }
            let queryToUpdateAdmin = "UPDATE administrateur SET login = ?, email = ?, password = ?  WHERE id = ?";
            let params = [login, email,password,id];
            if(!password){
                queryToUpdateAdmin = queryToUpdateAdmin.replace(', password = ?',' ');
                params = [login, email,id]
            }
            password = cryptotools.encrypt(password);
            try{
                const stmtUpdate = await this.sqliteHandler.prepare(queryToUpdateAdmin);
                stmtUpdate.run(params);
                stmtUpdate.finalize();
            }catch (e) {
                console.log(e);
                reject(e);
            }finally {
                await this.sqliteHandler.close();
            }
            resolve("succès");
        });
    }

    async deleteAdmin(adminId){
        return new Promise(async (resolve, reject) => {
            await this.sqliteHandler.open(this.dbPath);
            const queryToDeleteAdmin = 'DELETE FROM administrateur WHERE id = ?';
            const stmtAdmin = await this.sqliteHandler.prepare(queryToDeleteAdmin);
            try{
                stmtAdmin.run(adminId);
                stmtAdmin.finalize();
            }catch (e) {
                console.log(e);
                reject(e);
            }finally {
                await this.sqliteHandler.close();
            }
            resolve('succès');
        });
    }

    async getLoginExist(login){
        await this.sqliteHandler.open(this.dbPath);
        const queryToGetLogin = `SELECT id,login,email, password
                                          FROM administrateur
                                          WHERE login = ?`;
        const result = await this.sqliteHandler.get(queryToGetLogin, login);
        await this.sqliteHandler.close();
        return result;
    }
}

module.exports = AuthController;