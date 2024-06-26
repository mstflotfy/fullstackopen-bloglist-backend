const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const testingRouter = require('./controllers/testing');
const { MONGODB_URI } = require('./utils/config');

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URI)
  .then(console.log('connected to MongoDB'))
  .catch((error) => console.error(error));

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}
app.use('/api/login', loginRouter);
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);

app.use(middleware.errorHandler);

module.exports = app;
