import express from "express";
import { Subscription } from "./subscription.model.js";

const router = express.Router();

router.route("/").post(async (req, res) => {

    let data = await Subscription.findOne({ email: req.body.email });

    if(data){
        return res.status(500).json({
            message: "Email already exists"
        })
    }

    let newData = new Subscription({
        email: req.body.email,
        ipaddress: req.socket.remoteAddress,
        location: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        }
    })

    let details = await newData.save();

    if(!details){
        return res.status(500).json({
            message: "Server error occured"
        })
    }

    res.json({
        message: "You got subscribed!"
    })
})

export default router;