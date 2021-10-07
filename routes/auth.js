const express = require('express');
const router = express.Router();
const { join } = require('path');

const mods = [
    "sitav", "sohpief", "alis"
];

router.get('/main', (req, res) => {
    res.sendFile(join(__dirname, '../views/login.htm'));
});

router.get('/callback', (req, res) => {
    if(!req.query.email.endsWith('khanlabschool.org')) return res.redirect('/error?code=2');
    if(mods.includes(req.query.email.split("@")[0])) req.query.isMod = true;
    req.session.user = req.query;
    console.log(req.session.user);
    res.redirect('/home');
});

module.exports = router;