const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 }
});


const Item = mongoose.model('Item', ItemSchema);


module.exports = Item;
