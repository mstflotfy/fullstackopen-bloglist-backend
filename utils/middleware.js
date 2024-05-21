const jwt = require('jsonwebtoken');
const User = require('../models/user');

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    response.status(400).json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    response.status(400).json({ error: 'token invalid' });
  } else if (error.name === 'TokenExpiredError') {
    response.status(401).json({ error: 'token expired' });
  }

  return next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }

  request.user = user;
  next();
  return undefined;
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
