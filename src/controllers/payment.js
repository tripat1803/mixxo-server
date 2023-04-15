import { instance } from "../../config/razorpay.js";
import crypto from "crypto";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Shipping } from "../models/shipping.model.js";

export const checkout = async (req, res) => {
    try {
        let { mongoUser } = req.user;

        let cart = await Cart.findOne({ user_id: mongoUser._id }).populate("products.details");

        let amount = 0;

        cart.products.forEach((item) => {
            amount += (item.details.price - (item.details.price * (item.details.discount / 100)).toFixed(2)) * item.quantity
        })

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            notes: {
                userId: String(mongoUser._id),
                ...req.body.items
            }
        }

        const order = await instance.orders.create(options);

        if(!order){
            return res.status(500).json({
                message: "Some error occured"
            })
        }

        res.status(200).json({
            success: true,
            ...order
        })
    } catch(err){
        res.status(401).json({
            message: err.message
        })
    }
}

export const verification = async (req, res) => {
    try {
        let { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(body.toString()).digest('hex');

        if(expectedSignature === razorpay_signature){
            let details = await instance.orders.fetchPayments(razorpay_order_id);
            
            let cart = await Cart.findOne({user_id: details.items[0].notes.userId}).populate(["products.product_id", "products.details"]);

            let shipping = await Shipping.findOne({ user_id: details.items[0].notes.userId, default: true });

            let order = [];

            cart.products.forEach((item) => {
                order.push({
                    product_id: {
                        name: item.product_id.name,
                        description: item.product_id.description,
                        image: item.product_id.image
                    },
                    details: {
                        weight: item.details.weight,
                        price: item.details.price,
                        discount: item.details.discount,
                        shippingPrice: item.details.shippingPrice,
                    },
                    quantity: item.quantity
                })
            });

            let newOrder = new Order({
                user_id: details.items[0].notes.userId,
                products: order,
                shippingPrice: details.items[0].notes.shippingPrice,
                taxPrice: details.items[0].notes.taxPrice,
                totalPrice: details.items[0].amount/100,
                shippingId: {
                    mobile: shipping.mobile,
                    address: shipping.address,
                    pincode: shipping.pincode,
                    city: shipping.city,
                    state: shipping.state,
                }
            })
    
            let data = await newOrder.save();

            if(!data){
                return res.status(500).json({
                    message: "Unable to place order"
                })
            }

            await Cart.deleteOne({user_id: details.items[0].notes.userId});

            res.redirect("https://mixxo.in/profile/order");
        } else {
            let response = {
                success: false
            }
            res.status(200).json(response);
        }

    } catch(err){
        res.status(401).json({
            message: err.message
        })
    }
}

export const getKey = async (req, res) => {
    try{
        let key = process.env.RAZORPAY_KEY;

        res.status(200).json({
            key: key
        });
    } catch(err){
        res.status(401).json({
            message: err.message
        })
    }
}
