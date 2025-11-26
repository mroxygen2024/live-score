// server/src/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin.routes');
const apiRoutes = require('./routes/api.routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// mount routes
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// simple root endpoint
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Football Match Tracker backend' });
});

module.exports = app;
