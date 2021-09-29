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
            VALUES ('${quote}', '${saidby}', '${submby}', ${timestamp}, 0)
        `).run();
    }

    //Reads
    /**
     * @private
     * @param {string} key
     * @param {string} val 
     * @returns {string[]}
     */
    static _getQuotes = (key, val, comparator = '=') => {
        if(typeof(val) === 'string'){
            if(comparator === 'LIKE') val = `'%${val}%'`
            else val = `'${val}'`;
        } 
        
        return db.prepare(`
            SELECT * FROM quotebook WHERE ${key} ${comparator} ${val}`)
        .all();
    }

    static getQuotesByID = (id) => {
        return this._getQuotes('rowid', id)
    }

    static getQuotesBySearchTerm = (quote) => {
        return this._getQuotes('quote', quote, 'LIKE');
    }

    static getQuotesByAuthor = (author) => {
        return this._getQuotes('saidby', author, 'LIKE');
    }

    static getQuotesBySubmitter = (submitter) => {
        return this._getQuotes('submittedby', submitter, 'LIKE');
    }

    static getModQueue = () => {
        return this._getQuotes('approved', 0, '=')
    }

    //Actually have to put in effort for this one
    static getQuotesbyTimestamp = (lower, upper)=> {
        return db.prepare(`
            SELECT * FROM quotebook
            WHERE timestamp > ${lower} AND timestamp < ${upper}
        `).all();
    }
}

/**
 * Hitchcock uses the camera to follow the eyelines of the two observers.
 * Additionally, the only sounds able to be heard are the loud yes
 */