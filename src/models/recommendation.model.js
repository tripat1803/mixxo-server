import mongoose from "mongoose";

const recommendationSchema = mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    review_score: {
        type: Number,
        default: 0
    },
    order_score: {
        type: Number,
        default: 0
    },
    total_score: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

export const Recommendation = mongoose.model("recommendation", recommendationSchema);