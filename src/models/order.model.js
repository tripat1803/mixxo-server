import mongoose from "mongoose";
import { Recommendation } from "./recommendation.model.js";
import { User } from "./user.model.js";

const orderSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    shippingId: {
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
        }
    },
    products: [
        {
            product_id: {
                name: {
                    type: String,
                    required: true,
                    trim: true
                },
                description: {
                    type: String,
                    required: true,
                },
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
                ]
            },
            details: {
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
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        default: "Processing",
        enum: ["Processing", "Shipped", "Out for delivery", "Delivered"]
    }
}, {
    timestamps: true
});

orderSchema.post("save", async (data) => {
    await User.updateOne({ _id: data.user_id }, {
        $inc: {
            total_orders: 1
        }
    });
    data.products.forEach(async (item) => {
        await Recommendation.updateOne({details: item.details}, {
            $inc: {
                order_score: 3,
                total_score: 3
            }
        });
    });
});

export const Order = mongoose.model("orders", orderSchema);