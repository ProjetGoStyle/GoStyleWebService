const sqlite3 = require('sqlite3').verbose();

class SqliteHandler {
    db = null;

    constructor() {
    }

    open = (path) => {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(path,
                (err, row) => {
                    if (err) reject("Open error: " + err.message)
                    else resolve(path + " opened")
                }
            )
        })
    }

    // any query: insert/delete/update
    run = (query) => {
        return new Promise((resolve, reject) => {
            this.db.run(query,
                (err, row) => {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    }

    // any query: insert/delete/update
    prepare = (query) => {
        return new Promise((resolve, reject) => {
            const prepareQuery = this.db.prepare(query,
                (err) => {
                    if (err) reject(err.message)
                    else resolve(prepareQuery)
                })
        })
    }

    // first row read
    get = (query, params) => {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) reject("Read error: " + err.message)
                else {
                    resolve(row)
                }
            })
        })
    }

    // set of rows read
    all = (query, params) => {
        return new Promise((resolve, reject) => {
            if (params == undefined) params = []

            this.db.all(query, params, (err, rows) => {
                if (err) reject("Read error: " + err.message)
                else {
                    resolve(rows)
                }
            })
        })
    }

    // each row returned one by one 
    each = (query, params, action) => {
        return new Promise((resolve, reject) => {
            var db = this.db
            this.db.serialize(() => {
                this.db.each(query, params, (err, row) => {
                    if (err) reject("Read error: " + err.message)
                    else {
                        if (row) {
                            action(row)
                        }
                    }
                })
                this.db.get("", (err, row) => {
                    resolve(true)
                })
            })
        })
    }

    close = () => {
        return new Promise((resolve, reject) => {
            this.db.close()
            resolve(true)
        })
    }
}

module.exports = SqliteHandler;