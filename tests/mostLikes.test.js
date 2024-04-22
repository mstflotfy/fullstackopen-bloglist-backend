const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const { blogsSample, listWithOneBlog, listNoLikes } = require('./blogsSample');

describe('mostLikes', () => {
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogsSample);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 17 });
  });

  test('of list of one blog, is calculated correctly', () => {
    const result = listHelper.mostLikes(listWithOneBlog);
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes: 5 });
  });

  test('of empty list, returns {author: null, likes: 0}', () => {
    const result = listHelper.mostLikes([]);
    assert.deepStrictEqual(result, { author: null, likes: 0 });
  });

  test('of list with no likes returns { author: null, likes: 0 }', () => {
    const result = listHelper.mostLikes(listNoLikes);
    assert.deepStrictEqual(result, { author: null, likes: 0 });
  });
});
