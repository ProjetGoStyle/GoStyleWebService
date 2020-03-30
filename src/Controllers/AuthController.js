const cryptotools = require('./CryptoTools');

class AuthController {
    sqliteHandler = null;
    dbPath = "";

    constructor(dbPath, sqliteHandler) {
        this.sqliteHandler = sqliteHandler;
        this.dbPath = dbPath;
    }

    async login(login, password){
        if(login) return null;
        if(password) return null;
        await this.sqliteHandler.open(this.dbPath);
        const queryToGetAccess = `SELECT login, password
                                          FROM authentification
                                          WHERE login = ?`;
        const result = await this.sqliteHandler.get(queryToGetAccess, login);
        await this.sqliteHandler.close();
        if(result) return null;
        if(cryptotools.verify(password,result.password))
            return crypto.randomBytes(64).toString('base64');
        else return null;
    }
}

module.exports = AuthController;