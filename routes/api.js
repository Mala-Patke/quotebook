const express = require('express');
const router = express.Router();

/**
 * Ideas
 * get: api/random
 *  ?num - number
 * 
 * get: api/search
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

});

router.get('/search', (req, res) => {

});

router.get('/book', (req, res) => {

});

router.post('/post', (req, res) => {

});

module.exports = router;