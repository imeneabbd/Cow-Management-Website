const express = require('express');
const app = express();
const morgan = require('morgan');   //log
const bodyParser = require('body-parser');
const path = require('path'); 

const cowRoutes = require('./api/routes/cows');
const consultationRoutes = require('./api/routes/consultations');
const birthsRoutes = require('./api/routes/births');
const milkRoutes = require('./api/routes/milk');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Handling requests
app.use('/cows',cowRoutes);
app.use('/consultations',consultationRoutes);
app.use('/births',birthsRoutes);
app.use('/milk',milkRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'styles.css'));
});

app.get('/scripts.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'scripts.js'));
});
app.get('/script_consul.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'script_consul.js'));
});
app.get('/script_birth.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'script_birth.js'));
});app.get('/script_milk.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'script_milk.js'));
});


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next ) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;
