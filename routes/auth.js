const express = require('express');
const router = express.Router();
const { join } = require('path');

router.get('/main', (req, res) => {
    res.sendFile(join(__dirname, '../views/login.htm'));
})

router.get('/callback', (req, res) => {
    if(!req.query.email.endsWith('khanlabschool.org')) return res.redirect('/error?code=2')
    req.session.user = req.query;
    res.redirect('/');
})

module.exports = router;