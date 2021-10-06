const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'gj4398thg359ugb983h58tiejrf02943',
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    if(!req.session.user){
        return res.redirect('/auth/main');
    }

    res.render('home', {
        user: req.session.user
    });
});

app.get('error', (req, res) => {
    if(req.query.code === '2') return res.send('ERROR: Must be authenticated with KLS email');
});

app.listen(3000, () => {
    console.log('running!')
});