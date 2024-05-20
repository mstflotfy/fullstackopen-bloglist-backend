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

module.exports = {
  errorHandler,
};
