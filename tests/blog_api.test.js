const {
  test, after, beforeEach, describe,
} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const { Blog } = require('../models/blog');
// const { title } = require('node:process');

let authToken;

const api = supertest(app);

const getToken = async () => {
  const credentials = {
    username: 'mstflotfy',
    password: '123',
  };
  const response = await api
    .post('/api/login/')
    .send(credentials)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const { token } = response.body;

  return token;
};

describe('Test Blogs API', () => {
  describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
      // Ensure the db is in the same state before each test is run
      await Blog.deleteMany({});

      const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
      const promiseArray = blogObjects.map((blog) => blog.save());
      await Promise.all(promiseArray);

      // obtainn new token before each test is run
      // authToken = await helper.getAuthToken();
      authToken = await getToken();
    });

    test('blogs are returned as json & include the same number of init blogs', async () => {
      const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
        // .expect(200)
        .expect('content-type', /application\/json/);

      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test('blog unique identifier is id not _id', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
        .expect('content-type', /application\/json/);

      assert(response.body[0].id);
    });

    describe('Adding a post', () => {
      test('A valid blog can be added', async () => {
        const newBlog = {
          title: 'post request works',
          author: 'mstflotfy',
          url: '/test-post',
          likes: 1,
        };
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
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
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
          .send(newBlog)
          .expect(201)
          .expect('content-type', /application\/json/);
        assert.strictEqual(res.body.likes, 0);
      });

      test('a post without title or url is not added', async () => {
        const newBlog = {
          url: '/do-not-add',
          author: 'nobody',
          likes: 10,
        };
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
          .send(newBlog)
          .expect(400);
      });

      test('adding a post without providing a token fails with status code 401 (unauthorized)', async () => {
        const newBlog = {
          title: 'post request works',
          author: 'Mostafa Lotfy',
          url: '/test-post',
          likes: 1,
        };
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)
          .expect('content-type', /application\/json/);
      });
    });

    // DELETE
    // only the owner can delete
    describe('deleting a post', () => {
      test('succeeds with status code 204 with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb();

        // useing the id of the test user (mstflotfy) select a blog to del
        // otherwise we get a non authorized to delete error
        const blogToDel = blogsAtStart.find((blog) => blog.author === 'Mostafa Lotfy'); // here lies a part of the problem!!

        await api
          .delete(`/api/blogs/${blogToDel.id}`)
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
          .expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
      });
      test('fails with status 404 when the id is not found', async () => {
        const notFoundId = await helper.nonExistingId();
        await api
          .delete(`/api/blogs/${notFoundId}`)
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
          .expect(404);
      });
      test('fails with status code 400 when the id is not valid', async () => {
        const invalidId = '123';
        await api
          .delete(`/api/blogs/${invalidId}`)
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
          .expect(400);
      });
    });

    describe('updating a post', () => {
      test('succeeds with status code 200 with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];

        blogToUpdate.likes = 1000000000;

        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
          .send(blogToUpdate)
          .expect(200);

        const blogsAtEnd = await helper.blogsInDb();
        const likes = blogsAtEnd.map((b) => b.likes);
        assert(likes.includes(1000000000));
      });
      test('fails with status 404 when the id is not found', async () => {
        const notFoundId = await helper.nonExistingId();
        await api
          .put(`/api/blogs/${notFoundId}`)
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
          .expect(404);
      });
      test('fails with status code 400 when the id is not valid', async () => {
        const invalidId = '123';
        await api
          .put(`/api/blogs/${invalidId}`)
          .set('Authorization', `Bearer ${authToken}`) // Set the Authorization header with the token
          .expect(400);
      });
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
