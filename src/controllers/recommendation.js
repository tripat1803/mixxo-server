import { Recommendation } from "../models/recommendation.model.js";
import { RecommendProducts } from "../models/recommendProducts.model.js";

export const recommendProducts = async (req, res) => {
  try {
    let details = await RecommendProducts.find({}).populate({
      path: "total.product_id",
      populate: { path: "details.productDetailsId" },
    });

    if (!details) {
      return res.status(500).json({
        message: "Some error occured",
      });
    }

    res.status(200).json({
      // maxOrdered: details[0].maxOrdered,
      // maxRated: details[0].maxRated,
      total: details[0].total,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const createRecommendProducts = async (req, res) => {
  try {
    let details = await RecommendProducts.find({});

    if (details.length !== 0) {
      return;
    }

    const recommendProducts = new RecommendProducts({
      maxOrdered: [],
      maxRated: [],
      total: [],
    });

    await recommendProducts.save();
  } catch (err) {
    res.status(500).json({
      message: "Server error occured",
    });
  }
};

export const updateRecommendProducts = async () => {
  let order = [];
  let review = [];
  let total = [];
  async.parallel({
    task1: async function (callback) {
      try {
        let orderScore = await Recommendation.find({})
          .sort([["order_score", -1]])
          .limit(3);
        orderScore.forEach((item) => {
          order.push({
            product_id: item.product_id,
          });
        });
        callback(null, order);
      } catch (err) {
        callback(err, total);
      }
    },
    task2: async function (callback) {
      try {
        let reviewScore = await Recommendation.find({})
          .sort([["review_score", -1]])
          .limit(3);
        reviewScore.forEach((item) => {
          review.push({
            product_id: item.product_id,
          });
        });
        callback(null, review);
      } catch (err) {
        callback(err, total);
      }
    },
    task3: async function (callback) {
      try {
        let totalScore = await Recommendation.find({})
          .sort([["total_score", -1]])
          .limit(3);
        totalScore.forEach((item) => {
          total.push({
            product_id: item.product_id,
          });
        });
        callback(null, total);
      } catch (err) {
        callback(err, total);
      }
    },
    async function(err, results) {
      if (err) {
        console.log(err);
      } else {
        await RecommendProducts.updateMany(
          {},
          {
            $set: {
              maxOrdered: order,
              maxRated: review,
              total: total,
            },
          }
        );
        await Recommendation.updateMany(
          {},
          {
            $set: {
              review_score: 0,
              order_score: 0,
              total_score: 0,
            },
          }
        );
      }
    },
  });
};
