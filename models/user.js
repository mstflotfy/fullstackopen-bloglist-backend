const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    minLength: [3, 'must be 3 characters long at least'],
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash; // password hash should not be revealed
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
