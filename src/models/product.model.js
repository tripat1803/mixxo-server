import mongoose from "mongoose";
import { Category } from "./category.model.js";
import { Recommendation } from "./recommendation.model.js";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    details: [
        {
            productDetailsId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "productDetails"
            }
        }
    ],
    image: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

productSchema.post("save", async (data) => {
    await Category.findByIdAndUpdate(data.category, {
        $inc: {
            number: 1
        }
    });
    let newRecommendation = new Recommendation({
        product_id: data._id
    })
    await newRecommendation.save();
})

export const Product = mongoose.model("products", productSchema);