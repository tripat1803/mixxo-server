import { Shipping } from "../models/shipping.model.js";

export const createShippingDetails = async (req, res) => {
    try{
        let { mongoUser } = req.user;
        
        let data = await Shipping.findOne({ mobile: req.body.mobile, address: req.body.address, pincode: req.body.pincode, city: req.body.city, state: req.body.state });

        if(data){
            return res.status(500).json({
                message: "Details already exists"
            });
        }

        let response = await Shipping.updateMany({ user_id: mongoUser._id }, {
            default: false
        });

        let newShipping = Shipping({
            user_id: mongoUser._id,
            mobile: req.body.mobile,
            address: req.body.address,
            pincode: req.body.pincode,
            city: req.body.city,
            state: req.body.state,
            default: true
        });

        let details = await newShipping.save();
        if(!details){
            return res.status(500).json({
                message: "Some Error Occured"
            })
        }
        res.status(200).json(details);
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const removeShippingDetails = async (req, res) => {
    try{
        let shippingId = req.params.shippingId;

        let details = await Shipping.findOneAndDelete({ _id: shippingId });

        if(!details){
            return res.status(500).json({
                message: "No related details found"
            })
        }
        res.status(200).json({
            message: "Details Deleted"
        })
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const updateShippingDetails = async (req, res) => {
    try{
        let details = await Shipping.updateOne({ _id: req.body.shippingId }, {
            $set: {
                mobile: req.body.mobile,
                address: req.body.address,
                pincode: req.body.pincode,
                city: req.body.city,
                state: req.body.state
            }
        })

        if(details.matchedCount == 0){
            return res.status(500).json({
                message: "No related details found"
            })
        }
        if(details.modifiedCount == 0){
            return res.status(500).json({
                message: "Some error occured"
            })
        }

        res.status(200).json({
            message: "Details Modified"
        })
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const sendDefault = async (req, res) => {
    try{
        let { mongoUser } = req.user;

        let details = await Shipping.findOne({ user_id: mongoUser._id, default: true });

        if(!details || !details._id){
            return res.status(200).json({
                redirect: true
            });
        }

        res.status(200).json(details);
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const setShippingIdAsDefault = async (req, res) => {
    try{
        let { mongoUser } = req.user;
        let shippingId = req.params.shippingId

        await Shipping.updateMany({ user_id: mongoUser._id }, {
            $set: {
                default: false
            }
        });

        await Shipping.updateOne({ user_id: mongoUser._id, _id: shippingId }, {
            $set: {
                default: true
            }
        });

        res.status(200).json({
            message: "Updated"
        })
    } catch(err){
        res.status(401).json({message: err.message});
    }
}
