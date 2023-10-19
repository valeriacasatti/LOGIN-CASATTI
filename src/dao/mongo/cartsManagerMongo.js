import { cartsModel } from "./models/carts.model.js";

export class CartsManagerMongo {
  constructor() {
    this.model = cartsModel;
  }

  //get carts
  async getCarts() {
    try {
      const result = await this.model.find().lean();
      return result;
    } catch (error) {
      console.log(`get carts error: ${error.message}`);
      throw new Error(`get carts error: ${error.message}`);
    }
  }

  //add cart
  async addCart() {
    try {
      const cart = {};
      const result = await this.model.create(cart);
      return result;
    } catch (error) {
      console.log(`add cart error: ${error.message}`);
      throw new Error(`add cart error: ${error.message}`);
    }
  }

  //get cart by ID
  async getCartById(id) {
    try {
      const result = await this.model
        .findById(id)
        .populate("products.productId")
        .lean();
      if (!result) {
        throw new Error("cart does not exist");
      } else {
        return result;
      }
    } catch (error) {
      console.log(`get cart by ID error: ${error.message}`);
      throw new Error(`get cart by ID error: ${error.message}`);
    }
  }

  //delete cart
  async deleteCart(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        throw new Error("cart not found");
      } else {
        return result;
      }
    } catch (error) {
      console.log(`delete cart error: ${error.message}`);
      throw new Error(`delete cart error: ${error.message}`);
    }
  }

  //add product to cart
  async addProduct(cid, pid) {
    try {
      //verificar si el cart existe
      const cart = await this.getCartById(cid);
      if (cart) {
        //verificar si el product existe en el cart
        const product = cart.products.find(
          (product) => product.productId._id == pid
        );
        if (product) {
          //incrementar quantity del producto
          product.quantity += 1;
        } else {
          const newProductCart = {
            productId: pid,
            quantity: 1,
          };
          cart.products.push(newProductCart);
        }
      }
      const result = await this.model.findByIdAndUpdate(cid, cart, {
        new: true,
      });
      return result;
    } catch (error) {
      console.log(`add product to cart error: ${error.message}`);
      throw new Error(`add product to cart error: ${error.message}`);
    }
  }

  //delete product from cart
  async deleteProductCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);

      const product = cart.products.find(
        (product) => product.productId._id == pid
      );
      if (product) {
        const newProducts = cart.products.filter((product) => {
          return product.productId._id != pid;
        });
        cart.products = newProducts;
        const result = await this.model.findByIdAndUpdate(cid, cart, {
          new: true,
        });
        return result;
      } else {
        throw new Error("error deleting product...");
      }
    } catch (error) {
      console.log(`delete cart error: ${error.message}`);
      throw new Error(`delete cart error: ${error.message}`);
    }
  }

  //update product from cart
  async updateProductCart(cid, pid, newQuantity) {
    try {
      const cart = await this.getCartById(cid);
      const productIndex = cart.products.findIndex(
        (product) => product._id == pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        const result = await this.model.findByIdAndUpdate(cid, cart, {
          new: true,
        });
        return result;
      }
    } catch (error) {
      console.log(`update product cart error: ${error.message}`);
      throw new Error(`update product cart error: ${error.message}`);
    }
  }
}
