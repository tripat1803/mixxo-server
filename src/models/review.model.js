import mongoose from "mongoose";
import { Recommendation } from "./recommendation.model.js";
import { Product } from "./product.model.js";

const reviewSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        trim: true,
        required: true,
        maxlength: [200, "Length should be less than 200"]
    }
}, {
    timestamps: true
})

reviewSchema.post("save", async (data) => {
    await Recommendation.updateMany({product_id: data.product_id}, {
        $inc: {
            review_score: data.rating,
            total_score: data.rating
        }
    });

    await Product.updateOne({ _id: data.product_id }, {
        $inc: {
            totalReviews: 1
        }
    })
})

export const Review = mongoose.model("reviews", reviewSchema);