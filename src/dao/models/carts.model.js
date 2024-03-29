import mongoose from "mongoose";
const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
    products:{
        type: [
            {
                product: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
                quantity: {type: Number}
            }
        ], default: []
    }
})
cartsSchema.pre('findOne', function() {
    this.populate('products.product');
})
cartsSchema.pre('find', function() {
    this.populate('products.product');
})


export const cartModel = mongoose.model(cartsCollection, cartsSchema);