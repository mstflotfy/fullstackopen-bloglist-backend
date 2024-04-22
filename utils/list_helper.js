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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,

  mostBlogs,
};
