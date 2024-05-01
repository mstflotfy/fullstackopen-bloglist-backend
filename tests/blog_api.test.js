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

test.only('blogs are returned as json & includes the same number of init blogs', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('content-type', /application\/json/);

  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
