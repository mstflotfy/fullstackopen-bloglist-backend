const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const { blogsSample, listWithOneBlog, listNoAuthors } = require('./blogsSample');

describe('mostBlogs', () => {
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogsSample);
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 });
  });

  test('of list of one blog, returns {author, blogs: 1}', () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 });
  });

  test('of empty list, returns {author: null, blogs: 0}', () => {
    const result = listHelper.mostBlogs([]);
    assert.deepStrictEqual(result, { author: null, blogs: 0 });
  });

  test('of list with no authors returns author is null', () => {
    const result = listHelper.mostBlogs(listNoAuthors);
    assert.strictEqual(result.author, null);
  });
});
