const blogsRouter = require('express').Router();
const { Blog } = require('../models/blog');

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

  const selectedUser = request.user;

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
  const { user } = request;
  let blog;

  try {
    blog = await Blog.findById(request.params.id);
  } catch (error) {
    return response.status(400).json({ error: 'invalid id' });
  }

  if (!blog) return response.status(404).json({ error: 'id not found' });

  if (blog.user.toString() === user.id) {
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
  } else {
    return response.status(401).json({ error: 'unauthroized to delete' });
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
