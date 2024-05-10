const { Blog } = require('../models/blog');
const User = require('../models/user');

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

const initialUsers = [
  {
    name: 'Mostafa Lotfy',
    username: 'mstflotfy',
    passwordHash: '$2b$12$f82jEbHQ8p0oNZ5eRNDdcO5gPCDAxX4DtV7KLy3qLLx6Elib6My/6',
    blogs: [],
  },
  {
    name: 'Omar',
    username: 'oLotfy',
    passwordHash: '$2b$12$DesMUehHvHcaLEehRf4NT.fKhKOpmaRuq7MCVivOQgpf5O97xizsO',
    blogs: [],
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  initialUsers,
  usersInDb,
};
