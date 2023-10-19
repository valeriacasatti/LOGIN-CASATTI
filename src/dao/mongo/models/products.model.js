import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: {
    require: true,
    type: String,
  },
  description: {
    require: true,
    type: String,
  },
  price: {
    require: true,
    type: Number,
  },
  code: {
    require: true,
    type: String,
    unique: true,
  },
  stock: {
    require: true,
    type: Number,
  },
  status: {
    require: true,
    type: Boolean,
  },
  category: {
    require: true,
    type: String,
    enum: ["full", "top", "bottom"],
  },
  thumbnail: {
    require: true,
    type: String,
  },
});

productSchema.plugin(mongoosePaginate);

export const productsModel = new mongoose.model(
  productsCollection,
  productSchema
);
