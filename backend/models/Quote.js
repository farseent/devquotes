const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);