const mongoose = require('mongoose');

/*
  In stark contrast to the conventions of relational databases,
  references are now stored in both documents: the blog references the user who created it,
  and the user has an array of references to all of the blogs created by them.
*/

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {
  Blog,
};
