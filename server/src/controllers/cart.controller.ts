import express from "express";
import Cart from "../models/Cart/Cart";

const cartController = {
  async showCart(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void> {
    try {
      const { userId } = req.body.user._id;
      const myCart = await Cart.find({ user: userId });
      return res.status(200).json({ myCart });
    } catch (err) {
      return res.status(500).json({
        error: err.message
      });
    }
  },

  async addToCart(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void> {
    try {
      const { productId } = req.params;
      const { userId } = req.body.user._id;
      let myCart;
      myCart = await Cart.findOne({ user: userId });
      if (!myCart) {
        myCart = await Cart.create({ user: userId, products: [] });
      }
      myCart.products.push(productId);
      await myCart.save();
      return res.status(201).json({ myCart });
    } catch (err) {
      return res.status(500).json({
        error: err.message
      });
    }
  },

  async removeFromCart(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void> {
    try {
      const { productId } = req.params;
      const { userId } = req.body.user._id;
      const myCart = await Cart.findOne({ user: userId });

      if (myCart) {
        const newCartProducts = myCart.products.filter(
          (cartItem) => String(cartItem) !== productId
        );
        const newCart = await Cart.findByIdAndUpdate(
          String(myCart._id),
          { products: newCartProducts },
          { new: true }
        );
        return res.status(201).json({ newCart });
      } else {
        return res.status(404).json({ message: "User cart doesn't exists" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export = cartController;
