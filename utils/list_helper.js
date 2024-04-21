const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, x) => sum + x.likes, 0);

module.exports = {
  dummy,
  totalLikes,
};
