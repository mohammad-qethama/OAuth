'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/routes');
const logger = require('./middleware/logger.js');
const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');
const oauth = require('./middleware/oauth.js');


// Prepare the express app
const app = express();

// App Level MW
app.use(express.static('./src/public'));


app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// REDIRECT_URI = 'http://localhost:3000/oauth'

app.get('/oauth', oauth, (req, res) => {
  res.json({ token: req.token, user: req.user });
});

// app.use(authRoutes);
// app.use('/api/v1', v1Routes);
// app.use('/api/v2', v2Routes);




// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
