import mongoose from "mongoose";
import { Cart } from "./cart.model.js";

const userSchema = mongoose.Schema({
    firebase_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Length should be greater than 3"],
        maxlength: [30, "Length should be less than 30"]
    },
    lastname: {
        type: String,
        trim: true,
        minlength: [3, "Length should be greater than 3"],
        maxlength: [30, "Length should be less than 30"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    shippingInfo: [
        {
            shippingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "shippingDetails"
            }
        }
    ],
    total_orders: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    }
}, {
    timestamps: true
});

userSchema.virtual("fullname").get(() => {
    return this.firstname + " " + this.lastname;
});

// userSchema.post("save", async (userData) => {
//     let newCart = new Cart({
//         user_id: userData._id,
//         products: []
//     })
//     await newCart.save();
// });

export const User = mongoose.model("users", userSchema);