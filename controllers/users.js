const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { name, username, password } = request.body;

  // validate password
  if (!password) return response.status(401).json({ error: 'Password is required' });
  if (password.length < 3) return response.status(401).json({ error: 'Password is too weak' });

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    username,
    passwordHash,
  });

  const savedUser = await user.save();

  return response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;
