const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, x) => sum + x.likes, 0);

const favoriteBlog = (blogs) => blogs.reduce((acc, x) => {
  if ((x.likes > 0 && acc.likes === undefined) || (x.likes > acc.likes)) {
    return x;
  }
  return acc;
}, {});

const mostBlogs = (blogs) => {
  const authorBlogs = blogs.reduce((authors, x) => {
    const { author } = x; // grab the author from the current blog
    const existingAuthor = authors.find((obj) => obj.author === author);

    if (existingAuthor) {
      existingAuthor.blogs += 1;
      return authors;
    }
    authors.push({ author, blogs: 1 });

    return authors;
  }, []);

  return authorBlogs.reduce((author, x) => {
    if (x.blogs > author.blogs) {
      return x;
    }
    return author;
  }, { author: null, blogs: 0 });
};

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((authors, blog) => {
    const { author, likes } = blog; // grab the author from the current blog
    const existingAuthor = authors.find((obj) => obj.author === author);

    if (existingAuthor) {
      existingAuthor.likes += likes;
      return authors;
    }
    authors.push({ author, likes });

    return authors;
  }, []);

  return authorLikes.reduce((author, x) => {
    if (x.likes > author.likes) {
      return x;
    }
    return author;
  }, { author: null, likes: 0 });
};

/*
const _ = require('lodash');

const mostBlogsLodash = (blogs) => {
  // Use countBy to count the occurrences of each author in the blogs array
  const authorsBlogs = _.countBy(blogs, 'author');

  // Use maxBy to find the author with the highest blog count
  const authorWithMostBlogs =  _.max(Object.entries(authorsBlogs));
  return { author: authorWithMostBlogs[0], blogs: authorWithMostBlogs[1]}
};
*/

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,

  mostBlogs,
  mostLikes,
};
