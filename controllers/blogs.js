const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const { Blog } = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

/* blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then((blogs) => {
      response.json(blogs);
    });
}); */
// Use async/await instead of promises
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }
  const selectedUser = await User.findById(decodedToken.id);

  blog.user = selectedUser.id;
  blog.author = selectedUser.name;

  if (!blog.likes) blog.likes = 0;

  if (!blog.title || !blog.url) {
    response.status(400).end();
  } else {
    const savedBlog = await blog.save();
    selectedUser.blogs = selectedUser.blogs.concat(savedBlog._id);
    await selectedUser.save();
    response.status(201).json(savedBlog).end();
  }

  // return response.status(400);
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const deleted = await Blog.findByIdAndDelete(request.params.id);
    if (deleted) {
      response.status(204).end();
    } else {
      response.status(404).end();
    }
  } catch (err) {
    if (err.name === 'CastError') response.status(400).end().json({ error: 'Invalid blog ID' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const post = request.body;
  try {
    const updated = await Blog.findByIdAndUpdate(request.params.id, post, { new: true });
    if (updated) {
      response.status(200).json(updated).end();
    } else {
      response.status(404).end();
    }
  } catch (err) {
    if (err.name === 'CastError') response.status(400).end().json({ error: 'Invalid blog ID' });
  }
});

module.exports = blogsRouter;
