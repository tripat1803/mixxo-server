import { Cart } from "../models/cart.model.js";
import { ProductDetails } from "../models/productDetails.model.js";
import { Recommendation } from "../models/recommendation.model.js";
import { RecommendProducts } from "../models/recommendProducts.model.js";

export const createProductDetails = async (req, res) => {
    try{
        let newDetails = new ProductDetails({
            product_id: req.body.productId,
            weight: req.body.weight,
            price: req.body.price,
            discount: req.body.discount,
            shippingPrice: req.body.shippingPrice
        });

        let details = await newDetails.save();

        if(!details){
            return res.staus(500).json({
                message: "Som error occured"
            })
        }
        res.status(200).json(details);
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const getProductDetails = async (req, res) => {
    try{
        let details = await ProductDetails.findOne({ _id: req.params.id });

        if(!details){
            return res.staus(500).json({
                message: "Som error occured"
            })
        }
        
        res.status(200).json(details);
    } catch(err){
        res.status(500).json({
            message: err
        })
    }
}

export const deleteProductDetails = async (req, res) => {
    try{
        let details = await ProductDetails.findOneAndDelete({ _id: req.params.id });

        if(!details){
            return res.status(500).json({
                message: "No related details found"
            })
        }

        await Cart.updateMany({ "products.details": req.params.id }, {
            $pull: {
                products: {
                    details: req.params.id
                }
            }
        });
        
        res.status(200).json({
            message: "Details Deleted"
        })
    } catch(err){
        res.status(401).json({message: err.message});
    }
}
