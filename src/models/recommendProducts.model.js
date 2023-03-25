import mongoose from "mongoose";

const recommendProductsSchema = mongoose.Schema({
    maxOrdered: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            }
        }
    ],
    maxRated: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            }
        }
    ],
    total: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            }
        }
    ]
}, {
    timestamps: true
});

export const RecommendProducts = mongoose.model("recommendProducts", recommendProductsSchema);