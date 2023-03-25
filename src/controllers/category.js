import { Category } from "../models/category.model.js";
import cloud from "../../config/cloudinary.js";
import { Product } from "../models/product.model.js";

export const createCategory = async (req, res) => {
    try {
        let imageData = await cloud.uploader.upload(req.body.image, {
            folder: "MixxoCategories"
        });
        const newCategory = new Category({
            name: req.body.name,
            image: {
                public_id: imageData.public_id,
                url: imageData.url
            }
        });

        let details = await newCategory.save();

        if(details){
            res.status(200).json({message: "Category added", data: details});
        }else{
            res.status(500).json({message: "Some error occured"});
        }
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const getAllCategory = async (req, res) => {
    try {
        let details = await Category.find({});

        if(details){
            res.status(200).json(details);
        }
    } catch(err){
        res.status(401).json({message: err.message});
    }
}

export const deleteCategory = async (req, res) => {
    try {
        let check = await Product.find({category: req.params.id});

        if(check.length !== 0){
            return res.status(500).json({message: "Delete all the products of this category"});
        }

        let details = await Category.findByIdAndDelete(req.params.id);

        if(details.image && details.image.public_id){
            await cloud.uploader.destroy(details.image.public_id);
        }

        if(details){
            res.status(200).json(details);
        }
    } catch(err){
        res.status(401).json({message: err.message});
    }
}