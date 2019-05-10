// Require Express
const express = require('express');

const bodyParser = require('body-parser');

// Express server handling requests and responses

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/rules', require('./routes/rules'));

// app.get('/regras', RegraController.index);
// app.post('/regras', RegraController.store)delete;
// app.delete('/regras', RegraController.);


module.exports = app;