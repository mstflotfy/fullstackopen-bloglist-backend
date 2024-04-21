const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, x) => sum + x.likes, 0);

const favoriteBlog = (blogs) => blogs.reduce((acc, x) => {
  if ((x.likes > 0 && acc.likes === undefined) || (x.likes > acc.likes)) {
    return x;
  }
  return acc;
}, {});

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
