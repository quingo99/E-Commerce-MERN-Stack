const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");
const imageValidate = require("../utils/imageValidate");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "dnlofytx3",
  api_key: "361817852286635",
  api_secret: process.env.CLOUDINARY_SECRET,
});

const getProducts = async (req, res, next) => {
  try {
    
    const pageNum = Number(req.query.pageNum) || 1;
 
    let totalProducts = await Product.countDocuments({});

    //sort by name, price, etc
    let sort = {};
    let query = {};
    let priceQueryCondition = {};
    let ratingQueryCondition = {};
    let queryCondition = false;
    //check for price, rating
    if (req.query.price) {
      priceQueryCondition = { price: { $lte: Number(req.query.price) } };
      queryCondition = true;
    }
    if (req.query.rating) {
      ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
      queryCondition = true;
    }
    if (queryCondition) {
      query = {
        $and: [priceQueryCondition, ratingQueryCondition],
      };
    }

    //search product for category
    let categoryQueryCondition = {};
    const categoryName = req.params.categoryName || "";
    
    if (categoryName) {
      queryCondition = true;
      // console.log(categoryName);
      // let a = categoryName.replaceAll(",", "/")
      let regEx = new RegExp("^" + categoryName);

      categoryQueryCondition = { category: regEx };
    }
    
    //search from product list page
    if (req.query.category) {
      queryCondition = true;
      let a = req.query.category.split(",").map((item) => {
        if (item) return new RegExp("^" + item);
      });
      categoryQueryCondition = {
        category: { $in: a },
      };
    }

    //search by attribute
    //"Ram-4GB-8GB,Color-Red-Blue-Green"
    let attrsQueryCondition = [];
   
    
    if (req.query.attrs) {
      // attrs = Ram-1TB-2TB, color-blue-red
      attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
        if (item) {
          let a = item.split("-");
         
          let values = [...a];
          values.shift(); // remove first element of array;
          let a1 = {
            attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
          };
          acc.push(a1);
          
          return acc;
        } else return acc;
      }, []);
   

      queryCondition = true;
    }

    //this one for filter sort:
    const sortOption = req.query.sort || "";
    
    if (sortOption) {
      
      let sortOpt = sortOption.split("_");
      //The square brackets around [sortOpt[0]] are used to create a dynamic key in the sort object.
      sort = { [sortOpt[0]]: Number(sortOpt[1]) };
     
    }

    //search by bar
    const searchQuery = req.query.searchQuery || "";
    
    let searchQueryCondition = {};
    let select = {};
    if (searchQuery) {
      queryCondition = true;
      searchQueryCondition = { $text: { $search: searchQuery } };
      //This line of code is setting a score field in your returned documents which contains a text score for each document.
      //It can be used to understand how well each document matches the search query. This score can be used in client-side logic, e.g., to highlight results that match particularly well.
      select = {
        score: { $meta: "textScore" },
      };
      sort = { score: { $meta: "textScore" } };
    }

    if (queryCondition) {
      query = {
        $and: [
          priceQueryCondition,
          ratingQueryCondition,
          categoryQueryCondition,
          searchQueryCondition,
          ...attrsQueryCondition,
        ],
      };
      totalProducts = await Product.countDocuments(query);
      
    }

    //number of product perpage
    const products = await Product.find(query)
      .select(select)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);
    
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    //If you didn't use .populate('reviews'), the 'reviews' field in your product document would simply contain an array of ObjectId references, not the actual review documents.
    //By using .populate('reviews'), Mongoose automatically replaces these ObjectId references with the actual review documents, which can then be used in your application.
    const product = await Product.findById(req.params.id)
      .populate("reviews")
      .orFail();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const getBestsellers = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      { $sort: { category: 1, sales: -1 } },
      {
        $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } },
      },
      { $replaceWith: "$doc_with_max_sales" },
      { $match: { sales: { $gt: 0 } } },
      { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
      { $limit: 3 },
    ]);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const adminGetProducts = async (req, res, next) => {
  try {
    //console.log(req.user);
    const products = await Product.find({})
      .sort({ category: 1 })
      .select("name price category");
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const adminDeleteProduct = async (req, res, next) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.n === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product is removed" });
  } catch (err) {
    next(err);
  }
};

const adminCreateProduct = async (req, res, next) => {
  try {
    const product = new Product();
    const { name, description, count, price, category, attributesTable } =
      req.body;
    product.name = name;
    product.description = description;
    product.count = count;
    product.price = price;
    product.category = category;
    if (attributesTable.length > 0) {
      attributesTable.map((item) => {
        product.attrs.push(item);
      });
    }
    await product.save();

    res.json({
      message: "product created",
      productId: product.id,
    });
  } catch (err) {
    next(err);
  }
};

const adminUpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    const { name, description, count, price, category, attributesTable } =
      req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.count = count || product.count;
    product.price = price || product.price;
    product.category = category || product.category;

    if (attributesTable && attributesTable.length > 0) {
      product.attrs = [];
      attributesTable.map((item) => {
        product.attrs.push(item);
      });
    }
    await product.save();
    res.json({ message: "product updated" });
  } catch (err) {
    next(err);
  }
};

const adminUpload = async (req, res, next) => {
  try {
    
    if (!req.files || !!req.files.images === false) {
      return res.status(400).send("No files were uploaded.");
    }

    const validateResult = imageValidate(req.files.images);
    if (validateResult.error) {
      return res.status(400).send(validateResult.error);
    }

    //this help get the path of file name
    const path = require("path");
    //this help create random string to name the image
    const { v4: uuidv4 } = require("uuid");
    const uploadDirectory = path.resolve(
      __dirname,
      "../../frontend",
      "public",
      "img",
      "products"
    );
    let product = await Product.findById(req.query.productId).orFail();
    let imagesTable = [];
    if (Array.isArray(req.files.images)) {
      imagesTable = req.files.images;
    } else {
      imagesTable.push(req.files.images);
    }

    for (let image of imagesTable) {

      let imageId = uuidv4();
      var fileName = imageId + path.extname(image.name);
      let uploadPath = "" 
      let imagePathSave = ""
      if(process.env.NODE_ENV === "development"){
          uploadPath = uploadDirectory + "/" + fileName;
          //help move to the local path
          image.mv(uploadPath, function (err) {
            if (err) {
              return res.status(500).send(err);
            }
          });
          imagePathSave = "/img/products/" + fileName;
      }
     

      //upload to cloudinary
      else if(process.env.NODE_ENV === "production"){
        const uploadResult = await cloudinary.uploader
        .upload(image.tempFilePath, { folder: "products", public_id: imageId })
        .catch((err) => {
          return res.status(500).send(err);
        });
        if (uploadResult) {
          imagePathSave = uploadResult.secure_url;
        }
      }
      console.log(imagePathSave)
      product.images.push({ path: imagePathSave });
      
    }
    await product.save();
    console.log(product.images)
    return res.send({ message: "Images uploaded successfully" , imagePathSave: product.images});
  } catch (err) {
    next(err);
  }
};
const adminDeleteProductImage = async (req, res, next) => {
  try {
    const imagePath = decodeURIComponent(req.params.imagePath);
    const path = require("path");

    if (imagePath.includes("https://res.cloudinary.com")) {
      // Delete image from Cloudinary
      const publicId = "products/" + imagePath.split("/").pop().split(".")[0];
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === "not found") {
          return res.status(404).send("Image not found");
        }
      } catch (err) {
        return res.status(500).send("Failed to delete image from Cloudinary");
      }
    } else {
      // Delete image from local path
      try {
        const finalPath = path.resolve("../frontend/public") + imagePath;
        const fs = require("fs");

        // Delete the file
        fs.unlink(finalPath, (err) => {
          if (err) {
            return res.status(500).send("Failed to delete image from local path");
          }
        });
      } catch (err) {
        return res.status(500).send("Failed to process local image deletion");
      }
    }

    // Update product in the database
    try {
      console.log("Delete image from database")
      console.log(imagePath)
      console.log(req.params.productID)
      await Product.findOneAndUpdate(
        { _id: req.params.productID },
        { $pull: { images: { path: imagePath } } }
      ).orFail();
      return res.status(200).send("Image deleted successfully");
    } catch (err) {
      return res.status(500).send("Failed to update product images");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    next(err);
  }
};
module.exports = {
  getProducts,
  getProductById,
  getBestsellers,
  adminGetProducts,
  adminDeleteProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpload,
  adminDeleteProductImage,
};
