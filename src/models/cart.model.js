import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            details: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "productDetails",
                required: true
            },
            quantity: {
                type: Number,
                default: 0,
                required: true
            }
        }
    ]
}, {
    timestamps: true
})

export const Cart = mongoose.model("carts", cartSchema);