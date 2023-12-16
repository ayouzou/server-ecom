const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

  user_info: 
    {
      customer_id: {
        ref: 'User',
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      first_name: {
        type: String,
        required: true
      },
      last_name: {
        type: String,
        required: true
      },
      tele: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      }
    }
  ,
  products: [
    {
      product_id: {
        ref: 'Product',
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      product_name: {
        type: String,
      },
      price: {
        type: Number,
        require: [true, 'A product must have a price.'],
      },
      quantity: {
        type: Number,
        required: true
      },
      images: [
        {
          type: String,
          required: true,
        },
      ],
    }
  ],
  store_id: {
    ref: 'Store',
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'DELIVERING', 'DELIVERED'],
    default: 'PENDING'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
