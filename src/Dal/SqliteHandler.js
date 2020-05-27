const sqlite3 = require('sqlite3').verbose();

class SqliteHandler {
    db = null;

    constructor() {
    }

    /**
     * Permet d'ouvrir une connexion
     * @param path
     * @returns {Promise<unknown>}
     */
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

    /**
     * Permet d'exécuter les requêtes Insert/Update/delete
     * @param query
     * @returns {Promise<unknown>}
     */
    run = (query) => {
        return new Promise((resolve, reject) => {
            this.db.run(query,
                (err, row) => {
                    if (err) reject(err.message)
                    else resolve(true)
                })
        })
    }

    /**
     * Prépare les requêtes Insert/Update/Delete quand il y a un paramètre
     * @param query
     * @returns {Promise<unknown>}
     */
    prepare = (query) => {
        return new Promise((resolve, reject) => {
            const prepareQuery = this.db.prepare(query,
                (err) => {
                    if (err) reject(err.message)
                    else resolve(prepareQuery)
                })
        })
    }

    /**
     * Récupère la première ligne de la requête
     * @param query
     * @param params
     * @returns {Promise<unknown>}
     */
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

    /**
     * Récupère toutes les lignes d'une requête
     * @param query
     * @param params
     * @returns {Promise<unknown>}
     */
    all = (query, params) => {
        return new Promise((resolve, reject) => {
            if (params === undefined) params = []
            this.db.all(query, params, (err, rows) => {
                if (err) reject("Read error: " + err.message)
                else resolve(rows)
            });
        })
    }

    /**
     * retourne chaque ligne , une par une
     * @param query
     * @param params
     * @param action
     * @returns {Promise<unknown>}
     */
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

    /**
     * Ferme la connexion
     * @returns {Promise<unknown>}
     */
    close = () => {
        return new Promise((resolve, reject) => {
            this.db.close()
            resolve(true)
        })
    }
}

module.exports = SqliteHandler;