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

    async deleteCartProduct(cid, pid) {
        try {
            let i;
            const cart = await cartModel.find({_id: cid});
            const Nproducts = cart[0].products;
            Nproducts.forEach((p, index) => {
                if(pid == p._id.valueOf()) {
                    i = index;
                }
            });
            if(!isNaN(i)) {
                Nproducts.splice(i, 1);
                const result = await cartModel.findByIdAndUpdate(cid, {products: Nproducts});
                return result;
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteAllProducts(cid) {
        const result = cartModel.findByIdAndUpdate(cid, {products: []});
        return result;
    }

    async updateCart(cid, products) {
        const result = cartModel.find({ _id: cid }).updateMany({ products: products });
        return result;
      }

    async updateCartProd(cartId, productId) {
        const myProduct = {
          _id: productId,
          quantity: 1,
        };
        try {
            const result = await cartModel.find({ _id: cartId });

            const index = result[0].products.findIndex(prod => {
                const idToString = prod._id.valueOf();
                return idToString === myProduct._id;
            });
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
        } catch (error) {
          throw new Error(error);
        }
    }

    async updateProductQuantity(cid, pid, qty) {
        try {
            let i;
            const cart = await cartModel.find({_id: cid});
            const Nproducts = cart[0].products;
            Nproducts.forEach((p, index) => {
                if (pid == p._id.valueOf()) {
                    i = index;
                }
            }); 

            if(!isNaN(i)) {
                Nproducts[i].quantity = qty.quantity;
                const result = await cartModel.findByIdAndUpdate(cid, {products: Nproducts});
                return result;
            }
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