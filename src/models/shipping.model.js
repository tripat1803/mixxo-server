import mongoose from "mongoose";
import { User } from "./user.model.js";

const shippingInfoSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    state: {
        type: String,
        trim: true,
        required: true
    },
    default: {
        type: Boolean,
        default: false
    }
})

shippingInfoSchema.post("save", async (shippingData) => {
    await User.updateOne({ _id: shippingData.user_id }, {
        $push: {
            shippingInfo: {
                shippingId: shippingData._id
            }
        }
    })
})

shippingInfoSchema.post("findOneAndDelete", async (shippingData) => {
    await User.updateOne({ _id: shippingData.user_id }, {
        $pull: {
            shippingInfo: {
                shippingId: shippingData._id
            }
        }
    })
})

export const Shipping = mongoose.model("shippingDetails", shippingInfoSchema);