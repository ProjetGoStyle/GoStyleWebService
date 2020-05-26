class Controller {
    sqliteHandler = null;
    dbPath = "";

    constructor(dbPath,sqliteHandler) {
        this.sqliteHandler = sqliteHandler;
        this.dbPath = dbPath;
    }
}

module.exports = Controller