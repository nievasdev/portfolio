const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  elements: [{
    type: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
  technologies: [{
    type: String
  }]
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
