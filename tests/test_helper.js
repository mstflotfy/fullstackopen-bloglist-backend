const { Blog } = require('../models/blog');

const initialBlogs = [
  {
    title: 'How to become an early riser',
    author: 'mstflotfy',
    url: '/early-riser',
    likes: 10,
  },
  {
    title: 'Another title',
    author: 'another person',
    url: '/another-title',
    likes: 1000,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
  const newBlog = new Blog({
    title: 'will be deleted soon',
    url: 'to-delete',
  });
  await newBlog.save();
  await newBlog.deleteOne();

  return newBlog.id;
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
};
