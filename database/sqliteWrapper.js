//THIS FILE IS FOR TESTING ON LOCAL DATABASES ONLY
//DO NOT USE THIS IN PRODUCTION

const db = require('better-sqlite3')('tempdb.sqlite');

module.exports = class DBWrapper {
    static quoteProps = [
        "quote", 
        "saidby",
        "submittedby",
        "timestamp"
    ];

    static create = () => {
        db.prepare(`CREATE TABLE IF NOT EXISTS quotebook (
            quote TEXT NOT NULL,
            saidby TEXT NOT NULL,
            submittedby TEXT NOT NULL,
            timestamp BIGINT NOT NULL,
            approved INT
        )`).run();
    }

    static insert = (quote, saidby, submby, timestamp) => {
        db.prepare(`
            INSERT INTO quotebook (quote, saidby, submittedby, timestamp, approved)
            VALUES ("${quote}", "${saidby}", "${submby}", ${timestamp}, 0)
        `).run();
    }

    /**
     * @param {object} params 
     * @returns {string}
     */
    static _getQuotes = (key, val) => {
        if(typeof(val) === 'string') val = `'${val}'`;

        let res = {};
        for(i of this.quoteProps){
            res[i] = db.prepare(`
                SELECT ${i} FROM quotebook WHERE ${key} = ${val};
            `).all();
        }

        return res;
    }
}