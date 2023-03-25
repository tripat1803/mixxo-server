import admin from "../../config/firebase.js";
import { User } from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
    let token = req.headers["authorization"];

    if(!token){
        return res.status(500).json({
            message: "Unauthorised"
        });
    }

    let firebaseUser = await admin.auth().verifyIdToken(token);

    if(!firebaseUser){
        return res.status(500).json({
            message: "Unauthorised"
        });
    }

    let mongoUser = await User.findOne({ firebase_id: firebaseUser.uid });

    if(!mongoUser){
        return res.status(500).json({
            message: "Unauthorised"
        });
    }
    
    req.user = {
        firebaseUser,
        mongoUser
    }
    next();
}

export const verifyAdmin = async (req, res, next) => {
    let token = req.headers["authorization"];

    if(!token){
        return res.status(500).json({
            message: "Unauthorised"
        });
    }

    let firebaseUser = await admin.auth().verifyIdToken(token);

    if(firebaseUser == null || firebaseUser == undefined){
        return res.status(500).json({
            message: "Unauthorised"
        });
    }

    let mongoUser = await User.findOne({ firebase_id: firebaseUser.uid });

    if(!mongoUser){
        return res.status(500).json({
            message: "Unauthorised"
        });
    }

    if(mongoUser.role != "admin"){
        return res.status(500).json({
            message: "Unauthorised"
        });
    }
    
    req.user = {
        firebaseUser,
        mongoUser
    }
    next();
}