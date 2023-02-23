import { cartModel } from "../../models/cart.js";
import { productModel } from "../../models/product.js"

class CartManager {
    async read(cart) {
        try {
            if(cart === undefined) {
                const carts = await cartModel.find();
                return carts;
            }
            return cartModel.find().limit(cart);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCartById(cartId) {
        return await cartModel.find({_id: cartId});
    }

    async create() {
        try{
            const newCart = new cartModel();
            await newCart.save();
            return newCart;
        } catch(error) {
            throw new Error(error);
        }
    }

    async delete(cartId) {
        try{
            const result = await cartModel.findByIdAndDelete(cartId);
            return result;
        } catch(error) {
            throw new Error(error);
        }
    }

    async addProduct(cartId, productId) {
        try {
            const result = await cartModel.find({_id: cartId});
            if (result.length === 0) {
                throw new Error('carrito no encontrado');
            } else {
                result[0].products.push(productId);
                await cartModel.findByIdAndUpdate(cartId, result[0]);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateCartProd(cartId, productId) {
        const myProduct = {
          _id: productId,
          quantity: 1,
        };
        try {
          const result = await cartModel.find({ _id: cartId });
    
        //   if (result[0].products.length === 0) {
        //     result[0].products.push(myProduct);
        //     const resultSave = await cartModel.findByIdAndUpdate(cartId, {
        //       products: result[0].products,
        //     });
        //     return resultSave;

        //   } else {
            const index = result[0].products.findIndex(
              (product) => {product._id.valueOf() === myProduct._id; console.log(product._id.valueOf(), myProduct._id)} 
            );
            console.log(index);
            if (index === -1) {
              result[0].products.push(myProduct);
              const resultSave = await cartModel.findByIdAndUpdate(cartId, {
                products: result[0].products,
              });
              return resultSave;
            } else {
              result[0].products[index].quantity += 1;
              const resultSave = await cartModel.findByIdAndUpdate(cartId, {
                products: result[0].products,
              });
              return resultSave;
            }
        //   }
        } catch (error) {
          throw new Error(error);
        }
      }
}

class ProductManager {
    async read() {
        try {
            const products = await productModel.find();
            return products
        } catch (error) {
            throw new Error(error);
        }
    }

    async create(prod) {
        try{
            const newProducts = new productModel(prod);
            await newProducts.save();
            return newProducts;
        } catch(error) {
            throw new Error(error);
        }
    }

    async delete(productId) {
        try{
                const result = await productModel.findByIdAndDelete(productId);
                return result;
        } catch(error) {
            throw new Error(error);
        }
    }

    async update(productId, product) {
        try {
            const result = await productModel.findByIdAndUpdate(productId, product);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }
}
export {CartManager, ProductManager};