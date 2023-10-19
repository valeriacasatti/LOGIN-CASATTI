import { productsModel } from "./models/products.model.js";

export class ProductsManagerMongo {
  constructor() {
    this.model = productsModel;
  }

  //get products
  async getProducts() {
    try {
      const result = await this.model.find().lean();
      return result;
    } catch (error) {
      console.log(`get products error: ${error.message}`);
      throw new Error(`get products error: ${error.message}`);
    }
  }

  //get products paginate
  async getProductsPaginate(query, options) {
    try {
      const result = await this.model.paginate(query, options);
      return result;
    } catch (error) {
      console.log(`get products error: ${error.message}`);
      throw new Error(`get products error: ${error.message}`);
    }
  }

  //add product
  async addProduct(productInfo) {
    try {
      const result = await this.model.create(productInfo);
      return result;
    } catch (error) {
      console.log(`add product error: ${error.message}`);
      throw new Error(`add product error: ${error.message}`);
    }
  }

  //get product by ID
  async getProductById(id) {
    try {
      const result = await this.model.findById(id);
      return result;
    } catch (error) {
      console.log(`get product by id error: ${error.message}`);
      throw new Error(`the product with ID ${id} wasn't found`);
    }
  }

  //update product
  async updateProduct(id, updatedContent) {
    try {
      const result = await this.model.findByIdAndUpdate(id, updatedContent, {
        new: true,
      });
      if (!result) {
        throw new Error("product not found");
      } else {
        return result;
      }
    } catch (error) {
      console.log(`update product error: ${error.message}`);
      throw new Error(`update product error: ${error.message}`);
    }
  }

  //delete product
  async deleteProduct(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        throw new Error("product not found");
      } else {
        return result;
      }
    } catch (error) {
      console.log(`delete product error: ${error.message}`);
      throw new Error(`delete product error: ${error.message}`);
    }
  }
}
