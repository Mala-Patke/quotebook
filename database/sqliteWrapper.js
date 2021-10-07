//THIS FILE IS FOR TESTING ON LOCAL DATABASES ONLY
//DO NOT USE THIS IN PRODUCTION

const db = require('better-sqlite3')('tempdb.sqlite');

module.exports = class DBWrapper {
    static selects = [
        "rowid",
        "quote", 
        "saidby",
        "submittedby",
        "timestamp"
    ];

    //Scripts
    static create = () => {
        db.prepare(`CREATE TABLE IF NOT EXISTS quotebook (
            quote TEXT NOT NULL,
            saidby TEXT NOT NULL,
            submittedby TEXT NOT NULL,
            timestamp BIGINT NOT NULL,
            approved INT DEFAULT 0
        )`).run();
    }

    //Writes
    static insert = (quote, saidby, submby, timestamp) => {
        db.prepare(`
            INSERT INTO quotebook (quote, saidby, submittedby, timestamp, approved)
            VALUES ('${quote}', '${saidby}', '${submby}', ${timestamp}, 0);
        `).run();
    }
    
    static update = (key, val, compkey, compval) => {
        if(typeof(val) === "string") val = `'${val}'`;
        if(typeof(compval) === "string") compval = `'${compval}'` 

        //No need to use a comparer, shouldn't be updating more than one thing at once
        db.prepare(`
            UPDATE quotebook
            SET ${key} = ${val}
            WHERE ${compkey} = ${compval}
        `);
    }

    //Reads
    /**
     * Object model [ { key, comparer, value } ]
     * @param {object[]} params 
     * @returns {object[]}
     */
    static getQuote = (params) => {
        let sql = `SELECT ${this.selects.join(", ")} FROM quotebook WHERE`
        let paramkeys = params.map(e => e.key);
        console.log(params);
        paramkeys = paramkeys.filter(e => this.selects.includes(e));
        for(let { key, comparer, value} of params){
            sql += ` ${key} ${comparer} ${value} AND`
        }
        sql = sql.substr(0, sql.length-4) + ';';
        console.log(sql);
        return db.prepare(sql).all();
    }

    static getQuoteBook = () => {
        return db.prepare(`SELECT ${this.selects.join(", ")} FROM quotebook --WHERE approved = 1`).all();
    }
}

/**
 * Hitchcock uses the camera to follow the eyelines of the two observers.
 * Additionally, the only sounds able to be heard are the loud yes
 */