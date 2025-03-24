const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  description: {
    type: String,
    default: 'Freshly brewed coffee'
  },
  category: {
    type: String,
    enum: ['hot', 'cold'],
    default: 'hot'
  },
  image: {
    type: String,
    default: 'default-coffee.jpg'
  }
});

module.exports = mongoose.model('Product', productSchema);