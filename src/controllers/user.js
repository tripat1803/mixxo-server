import { User } from "../models/user.model.js"

export const createUser = async (req, res) => {
    try{
        const newUser = new User({
            firebase_id: req.body.firebase_id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        });

        let user = await newUser.save();

        if(!user){
            return res.status(500).json({message: "User not found"});
        }
        res.status(200).json(user);
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const getUser = async (req, res) => {
    try{
        let { mongoUser } = req.user;

        let user = await User.findOne({ _id: mongoUser._id }).populate("shippingInfo.shippingId");
    
        if(!user){
            return res.status(500).json({message: "User not found"});
        }
        res.status(200).json(user);
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const updateUser = async (req, res) => {
    try {
        let { mongoUser } = req.user;
        let details = await User.updateOne({ _id: mongoUser._id }, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
            }
        })
        if(details.matchedCount == 0){
            return res.status(500).json({
                message: "No such User"
            });
        }
        if(details.modifiedCount == 0){
            return res.status(500).json({
                message: "Some Error Occured"
            });
        }
        res.status(200).json({message: "User Details Modified"});
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const createAdminUser = async (req, res) => {
    try{
        let details = await User.updateOne({ firebase_id: req.body.firebase_id }, {
            $set: {
                role: "admin"
            }
        });
        if(details.matchedCount == 0){
            return res.status(500).json({
                message: "No such User"
            });
        }
        if(details.modifiedCount == 0){
            return res.status(500).json({
                message: "Some Error Occured"
            });
        }
        res.status(200).json({message: "Admin user created"});
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const getAllUsers = async (req, res) => {
    try{
        let page = req.body.page || 1;
        let limit = req.body.limit || 15;
        let skip = (page - 1) * limit;

        let count = await User.find({}).count();
        let details = await User.find({}).skip(skip).limit(limit).lean();

        if(!details){
            return res.status(500).json({
                message: "Some error occured"
            });
        }

        res.status(200).json({
            data: details,
            count
        });
    } catch(err){
        res.status(500).json({
            messagee: "Some error occured"
        })
    }
}
