import { Cart } from "../models/cart.model.js"

export const verifyCart = async (req, res, next) => {
    let { mongoUser } = req.user;

    let data = await Cart.findOne({ user_id: mongoUser._id });

    if(!data){
        let newCart = new Cart({
            user_id: mongoUser._id,
            products: []
        })

        data = await newCart.save();
    }

    req.cart = data;
    next();
}