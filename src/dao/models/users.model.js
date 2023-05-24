import mongoose from 'mongoose';

export const userCollection = 'usuarios';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true },
  phone:{type: Number},
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: {type: mongoose.Schema.Types.ObjectId, ref: 'carts', default: []},
  role: {type: String, required: true, default: 'user'}
});

userSchema.pre('findOne', function() {
  this.populate('cart');
})

export const userModel = mongoose.model(userCollection, userSchema);