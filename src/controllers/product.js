import cloud from "../../config/cloudinary.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ProductDetails } from "../models/productDetails.model.js";
import { Recommendation } from "../models/recommendation.model.js";
import { RecommendProducts } from "../models/recommendProducts.model.js";
import async from "async";
import { Category } from "../models/category.model.js";

export const createProduct = async (req, res) => {
  try {
    let imageData = [];
    let data = await Promise.all(req.body.image.map((item) => {
      return cloud.uploader.upload(item, {
        folder: "MixxoProducts",
      });
    }));

    data.forEach((item) => {
      imageData.push({
        public_id: item.public_id,
        url: item.secure_url
      })
    })

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.categoryId,
      details: [],
      image: imageData,
    });

    let details = await product.save();

    if (!details) {
      return res.status(500).json({ message: "Some Error Occured" });
    }

    res.status(200).json({
      message: "Product added",
      details
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const uploadProductImage = async (req, res) => {
  try {
    let uploadData = await cloud.uploader.upload(req.body.image, {
      folder: "MixxoProducts",
    });
    let results = await Product.updateOne(
      { _id: req.body.productId },
      {
        $push: {
          image: {
            public_id: uploadData.public_id,
            url: uploadData.url,
          },
        },
      }
    );

    if (results.matchedCount == 0) {
      return res.status(500).json({ message: "Product not found" });
    }
    if (results.modifiedCount == 0) {
      return res.status(500).json({ message: "Some error occured" });
    }
    res.status(200).json({ message: "Product Image added" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    let uploadData = await cloud.uploader.destroy(req.body.public_id);

    if (!uploadData) {
      return res.status(500).json({
        message: "Error in deleting image",
      });
    }

    let results = await Product.updateOne(
      { _id: req.body.productId },
      {
        $pull: {
          image: {
            public_id: req.body.public_id,
          },
        },
      }
    );

    if (results.matchedCount == 0) {
      return res.status(500).json({ message: "Product not found" });
    }
    if (results.modifiedCount == 0) {
      return res.status(500).json({ message: "Some error occured" });
    }
    res.status(200).json({ message: "Product Image deleted" });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    let productId = req.params.id;
    let details = await Product.findOne({ _id: productId }).populate([
      "category",
      "details.productDetailsId",
    ]);

    if (!details) {
      return res.status(500).json({ message: "Product not found" });
    }
    res.status(200).json(details);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    let details = await Product.find({}).populate([
      "category",
      "details.productDetailsId",
    ]);

    if (!details) {
      return res.status(500).json({ message: "Product not found" });
    }
    res.status(200).json(details);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id = "" } = req.body;
  Product.findById(id, (err, product) => {
    if (err) {
      return res.status(500).json({ message: "Product not found" });
    }
    if (product) {
      async.parallel(
        {
          task1: function (callback) {
            product.remove().then(() => {
              callback(null, "Product Removed");
            });
          },
          task2: function (callback) {
            Cart.updateMany(
              { "products.product_id": id },
              {
                $pull: {
                  products: {
                    product_id: id,
                  },
                },
              }
            ).then(() => {
              callback(null, "Cart Updated");
            })
          },
          task3: function (callback) {
            ProductDetails.deleteMany({ product_id: id }).then(() => {
              callback(null, "ProductDetails Deleted");
            })
          },
          task4: function (callback) {
            Recommendation.deleteMany({ product_id: id }).then(() => {
              callback(null, "Recommendation Deleted");
            })
          },
          task5: function (callback) {
            RecommendProducts.updateMany(
              {},
              {
                $pull: {
                  maxOrdered: {
                    product_id: id,
                  },
                  maxRated: {
                    product_id: id,
                  },
                  total: {
                    product_id: id,
                  },
                },
              }
            ).then(() => {
              callback(null, "RecommendProducts Updated");
            })
          },
          task6: function (callback) {
            Category.findByIdAndUpdate(product.category, {
              $inc: {
                number: -1
              }
            }).then(() => {
              callback(null, "Category Updated");
            });
          }
        },
        function (err, results) {
          if (err) {
            return res.status(500).json({ message: "Some error occured" });
          }
          res.status(200).json({ message: "Product deleted" });
        }
      );
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  });
};

export const getCategory = async (req, res) => {
  try {
    let limit = req.body.limit || 6;
    let page = req.body.page || 1;
    let skip = (page - 1) * limit;

    let details = await Product.find({ category: { $in: req.body.categoryId } })
      .skip(skip)
      .limit(limit)
      .populate(["details.productDetailsId"]);

    if (!details) {
      return res.status(500).json({ message: "Some error occured" });
    }

    res.status(200).json(details);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

export const getProductByCategory = async (req, res) => {
  try {
    let productId = req.params.id;

    let response = await Product.findOne({ _id: productId });

    if (!response) {
      return res.status(500).json({
        message: "No product found",
      });
    }

    let details = await Product.find({ category: response.category })
      .limit(4)
      .populate(["details.productDetailsId"]);

    if (!details) {
      return res.status(500).json({ message: "Some error occured" });
    }

    let newDetails = details.filter((item) => {
      return String(item._id) !== productId;
    });

    res.status(200).json(newDetails);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

export const getAllCategoryProducts = async (req, res) => {
  try {
    let details = await Product.aggregate([{
      $group: {
        _id: "$category",
        outlets: {
          $addToSet: "$$ROOT"
        }
      }
    }]);

    let data1 = await Category.populate(details, {
      path: "_id"
    });

    let finalData = await ProductDetails.populate(data1, {
      path: "outlets.details.productDetailsId"
    })

    if (!finalData) {
      return res.status(500).json({ message: "Some error occured" });
    }

    res.status(200).json(finalData);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

export const updateProduct = async (req, res) => {
  try{
    let { productId, name, description, image } = req.body;
    
    if(image){
      let imageData = [];
      let data = await Promise.all(req.body.image.map((item) => {
        return cloud.uploader.upload(item, {
          folder: "MixxoProducts",
        });
      }));

      data.forEach((item) => {
        imageData.push({
          public_id: item.public_id,
          url: item.secure_url
        })
      })
      let details = await Product.updateOne({ _id: productId }, {
        $set: {
          name,
          description
        },
        $push: {
          image: imageData
        }
      });
      return res.status(200).json({
        message: "Product details updated"
      });
    }
    let details = await Product.updateOne({ _id: productId }, {
      $set: {
        name,
        description
      }
    });

    res.status(200).json({
      message: "Product details updated"
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}
