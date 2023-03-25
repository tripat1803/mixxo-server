import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    ipaddress: {
        type: String,
        trim: true,
        default: ""
    },
    location: {
        latitude: {
            type: String,
            trim: true,
            default: ""
        },
        longitude: {
            type: String,
            trim: true,
            default: ""
        }
    }
}, {
    timestamps: true
})

export const Subscription = mongoose.model("subscription", subscriptionSchema);