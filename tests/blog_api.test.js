const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const { Blog } = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  // Ensure the db is in the same state before each test is run
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('blogs are returned as json & include the same number of init blogs', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('content-type', /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test('blog unique identifier is id not _id', async () => {
  const response = await api.get('/api/blogs');
  assert(response.body[0].id);
});

test('A valid blog can be added', async () => {
  const newBlog = {
    title: 'post request works',
    author: 'mstflotfy',
    url: '/test-post',
    likes: 1,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('content-type', /application\/json/);
  const blogsAfter = await helper.blogsInDb();
  assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1);

  const blogsTitles = blogsAfter.map((b) => b.title);
  assert(blogsTitles.includes(newBlog.title));
});

test('adding a post without likes defaults to zero', async () => {
  const newBlog = {
    title: 'post without likes',
    author: 'somebody',
    url: '/test-likes',
  };
  const res = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('content-type', /application\/json/);
  assert.strictEqual(res.body.likes, 0);
});

test.only('a post without title or url is not added', async () => {
  const newBlog = {
    url: '/do-not-add',
    author: 'nobody',
    likes: 10,
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
