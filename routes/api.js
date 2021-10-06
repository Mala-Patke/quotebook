const express = require('express');
const db = require('../database/sqliteWrapper');
const router = express.Router();

/**
 * Ideas
 * get: api/random
 *  ?num - number
 * 
 * get: api/search/
 *  ?id - quote id
 *  ?keyword - search keyword
 *  ?before - before date
 *  ?after - after date
 *  ?saidby - person who said it
 *  ?submittedby - person who submitted it
 * 
 * get: api/quotebook
 *  Fetches entire quotebook
 * 
 * post: api/post
 *  body contains quote, quoted name, submitter name. timestamp handled by backend
 */

router.get('/random', (req, res) => {
    let count = req.query.num || 1;
    let idarray = db.getQuoteBook();
    if(idarray.length > count) count = idarray.length; 
    
    let ret = [];
    for(let i = 0; i < count; i++){
        let val = idarray[Math.floor(Math.random() * idarray.length)];
        idarray = idarray.filter(e => e !== val);
        ret.push(val);
    }

    res.status(200).send(ret);

});

const paramMap = {
    id: {
        key: "rowid",
        comparator: "=",
    },
    keyword: {
        key: "quote",
        comparator: "LIKE",
        isString: true
    },
    saidby: {
        key: "saidby",
        comparator: "LIKE",
        isString: true
    },
    submittedby: {
        key: "submittedby",
        comparator: "LIKE",
        isString: true
    },
    before: {
        key: "timestamp",
        comparator: "<",
    },
    after: {
        key: "timestamp",
        comparator: ">",
    }
}

router.get('/search', (req, res) => {
    if(!Object.keys(req.query).length) return res.status(400).send({code: 400, message: "Error: Missing parameters. Search requires at least one parameter to run."});
    
    let queryargs = [];
    for(let param of Object.keys(req.query)){
        if(Object.keys(paramMap).includes(param)) {
            if(paramMap[param].isString) req.query[param] = `'%${req.query[param]}%'`;
            queryargs.push({ 
                key: paramMap[param].key,
                comparator: paramMap[param].comparator,
                value: req.query[param]
            });
        } else return res.status(400).send({code: 400, message: "Error: Malformed parameters"});
    }

    let result = db.testGetQuote(queryargs)
    res.send(result);
});

router.get('/book', (req, res) => {
    res.send(db.getQuoteBook() || {code: 500, message: "Something went wrong idk what lmao"});
});

router.post('/post', express.json(), ({ body }, res) => {
    console.log(body);
    if(
        body.quote &&
        body.saidby &&
        body.submittedby
    ) {
        db.insert(body.quote, body.saidby, body.submittedby, Date.now());
        return res.status(200).send({code: 200, message: "Interaction Complete"});
    } else res.status(400).send({code: 400, message: "Invalid Request: Missing parameter(s)"});
});

module.exports = router;