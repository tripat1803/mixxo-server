import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";


export const createReview = async (req, res) => {
    try{
        let { mongoUser } = req.user;

        let check = await Product.findOne({ _id: req.body.productId });

        if(!check){
            return res.status(500).json({
                message: "No product found"
            });
        }

        let newReview = new Review({
            user_id: mongoUser._id,
            product_id: req.body.productId,
            rating: req.body.rating,
            message: req.body.message
        })

        let details = await newReview.save();

        if(!details){
            return res.status(500).json({
                message: "Some error occured"
            })
        }

        res.status(200).json(details);
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const getReview = async (req, res) => {
    try{
        let page = req.body.page || 1;
        let limit = req.body.limit || 10;
        let skip = (page - 1) * limit;

        let count = await Review.find({ product_id: req.body.productId }).count();
        let details = await Review.find({ product_id: req.body.productId }).populate(["product_id", "user_id"]).skip(skip).limit(limit);

        if(!details){
            return res.status(500).json({
                message: "Product id not found"
            })
        }

        res.status(200).json({
            count,
            details
        });
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

