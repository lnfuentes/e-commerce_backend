import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = 'product';

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, required: true},
    code: {type: String, unique: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    status: {type: Boolean, required: true}
}, {versionKey: false})

productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema);