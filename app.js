const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

// Logging system
const morgan = require('morgan');
app.use(morgan('tiny'));

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const guideRoutes = require('./routes/guides');
const favoriteRoutes = require('./routes/favorites')

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/guides', guideRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/', authRoutes)


/* 404 handler */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(err);
});

/* general error handler */
app.use((err, req, res, next) => {
  if (err.stack) console.log(err.stack)

  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
