const express = require('express');
const session = require('express-session');
const { readdirSync } = require('fs');
require('dotenv').config();

const app = express();

const views = readdirSync('./views')
    .filter(e => e.endsWith('.ejs'))
    .map(e => e.slice(0, -4));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

function isAuth(req, res, next) {
    if(!req.session.user) {
        return res.redirect('/auth/main');
    };
    next();
}

app.get('/', isAuth, (req, res) => res.redirect('/home'));

app.get('/:page', isAuth, (req, res, next) => {
    if(!views.includes(req.params.page)) return res.redirect('/error?code=404');

    res.render(req.params.page, {
        user: req.session.user
    });
});

app.get('/error', (req, res) => {
    if(req.query.code === '2') return res.send('ERROR: Must be authenticated with KLS email');
    if(req.query.code === '404') return res.send('ERROR: 404 page not found')
});

app.listen(process.env.PORT, () => {
    console.log(`Running on http://localhost:${process.env.PORT}/`);
});