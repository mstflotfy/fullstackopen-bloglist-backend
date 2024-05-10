const {
  test, after, beforeEach, describe,
} = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

describe('Test User API:', () => {
  describe('creating a new user', () => {
    // Ensure the db is in the same state before each test is run
    beforeEach(async () => {
      await User.deleteMany({});
      await User.insertMany(helper.initialUsers);
    });

    test('db includes intial users', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('content-type', /application\/json/);

      assert.strictEqual(response.body.length, helper.initialUsers.length);
    });

    test('fails when username is missing', async () => {
      const usersBefore = helper.usersInDb();

      const newUser = {
        name: 'No body',
        username: '',
        password: '1234',
      };
      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('content-type', /application\/json/);

      assert.strictEqual(JSON.parse(response.error.text).error, 'User validation failed: username: Path `username` is required.');

      const usersAfter = helper.usersInDb();
      assert.strictEqual(usersAfter.length, usersBefore.length);
    });

    test('fails when username is less than 3 characters', async () => {
      const usersBefore = await helper.usersInDb();

      const newUser = {
        name: 'No body',
        username: 'mo',
        password: '1234',
      };
      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('content-type', /application\/json/);

      assert.strictEqual(JSON.parse(response.error.text).error, 'User validation failed: username: must be 3 characters long at least');

      const usersAfter = await helper.usersInDb();
      assert.strictEqual(usersAfter.length, usersBefore.length);
    });

    test('fails when the same username already exists in db', async () => {
      const usersBefore = await helper.usersInDb();

      const newUser = {
        name: 'm lotfy',
        username: 'mstflotfy',
        password: '123',
      };
      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('content-type', /application\/json/);

      assert.strictEqual(JSON.parse(response.error.text).error, 'expected `username` to be unique');

      const usersAfter = await helper.usersInDb();
      assert.strictEqual(usersAfter.length, usersBefore.length);
    });

    test('fails when a password is not provided', async () => {
      const usersBefore = await helper.usersInDb();

      const newUser = {
        name: 'm lotfy',
        username: 'newUsername',
        password: '',
      };
      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(401)
        .expect('content-type', /application\/json/);

      assert.strictEqual(JSON.parse(response.error.text).error, 'Password is required');

      const usersAfter = await helper.usersInDb();
      assert.strictEqual(usersAfter.length, usersBefore.length);
    });

    test('fails when the provided password is less than 3 characters long', async () => {
      const usersBefore = await helper.usersInDb();

      const newUser = {
        name: 'm lotfy',
        username: 'newUsername',
        password: '12',
      };
      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(401)
        .expect('content-type', /application\/json/);

      assert.strictEqual(JSON.parse(response.error.text).error, 'Password is too weak');

      const usersAfter = await helper.usersInDb();
      assert.strictEqual(usersAfter.length, usersBefore.length);
    });

    test('succeeds when username and password are valid', async () => {
      const usersBefore = await helper.usersInDb();

      const newUser = {
        name: 'Somebody',
        username: 'newUsername',
        password: '423',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('content-type', /application\/json/);

      const usersAfter = await helper.usersInDb();
      assert(usersAfter.length, usersBefore.length + 1);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
