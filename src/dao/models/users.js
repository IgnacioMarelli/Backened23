import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const userCollection = 'usuarios';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
});

export const userModel = mongoose.model(userCollection, userSchema);