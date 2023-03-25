import mongoose from "mongoose";
import { Product } from "./product.model.js";

const productDetailsSchema = mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    shippingPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

productDetailsSchema.post("save", async (details) => {
    await Product.updateOne({ _id: details.product_id }, {
        $push: {
            details: {
                productDetailsId: details._id
            }
        }
    });
})

productDetailsSchema.post("findOneAndDelete", async (details) => {
    await Product.updateOne({ _id: details.product_id }, {
        $pull: {
            details: {
                productDetailsId: details._id
            }
        }
    })
})

export const ProductDetails = mongoose.model("productDetails", productDetailsSchema);