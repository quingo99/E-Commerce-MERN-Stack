const User = require("../models/UserModel")
const Review = require("../models/ReviewModel")
const Product = require("../models/ProductModel")
const { hashPassword, comparePasswords } = require("../utils/hashPassword")
const generateAuthToken = require("../utils/generateAuthToken")


const getUsers = async (req, res, next) => {
    try {
        //Product.create({name: "Panasonic"})
        const users = await User.find({})//.select("-password")//dont show password
        res.json(users);
    } catch (error) {
        next(error)
    }
}

const registerUser = async (req, res, next) => {
    try {
        const { name, lastName, email, password } = req.body;
        if (!(name && lastName && email && password)) {
            return res.status(400).send("All inputs are require");
        }
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ error: "user exists" })
        } else {
            const hashedPassword = hashPassword(password)
            const user = await User.create({
                name,
                lastName,
                email: email.toLowerCase(),
                password: hashedPassword
            })
            res
                .cookie("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict"
                })
                .status(201)
                .json({
                    success: "User created",
                    userCreated: {
                        _id: user._id,
                        name: user.name,
                        lastname: user.lastName,
                        email: user.email,
                        isAdmin: user.isAdmin,
                    },
                });

        }
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password, doNotLogOut } = req.body;
        if (!(email && password)) {
            res.status(401).send("All input are required")
        }
        
        const user = await User.findOne({ email })
        if (user && comparePasswords(password, user.password)) {
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            }
            if (doNotLogOut) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }//7 days
            }
            return res.cookie("access_token", generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin), cookieParams).json({
                success: "user logged in", userLoggedIn:
                {
                    _id: user._id,
                    name: user.name,
                    lastname: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    doNotLogOut: doNotLogOut
                }
            });
        }
        else{
            return res.status(401).send("Wrong credential")
        }

    } catch (error) {
        next(error);
    }
}
const updateUserProfile = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).orFail();
      user.name = req.body.name || user.name;
      user.lastName = req.body.lastName || user.lastName;
      user.phoneNumber = req.body.phoneNumber?.trim() || user.phoneNumber;
      user.address = req.body.address?.trim() || user.address;
      user.country = req.body.country?.trim() || user.country;
      user.zipCode = req.body.zipCode?.trim() || user.zipCode;
      user.city = req.body.city?.trim() || user.city;
      user.state = req.body.state?.trim() || user.state;
      if (req.body.password !== user.password) {
        user.password = hashPassword(req.body.password);
      }
      await user.save(); 
  
      res.json({
        success: "user updated",
        userUpdated: {
          _id: user._id,
          name: user.name,
          lastname: user.lastName,
          isAdmin: user.isAdmin,
        },
      });
    } catch (err) {
      next(err);
    }
  };
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail();
        return res.send(user);
    } catch (error) {
        next(error);
    }
}

const writeReview = async (req, res, next) => {
   
    try {
        //check whether product is reviewed by user
        const product = await Product.findById(req.params.productId).populate("reviews");
        const alreadyReviewed = product.reviews.find((r) => r.user._id.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            return res.status(400).send("product already reviewed");
        }


        // get comment, rating from request.body:
        //session help with if there is any error during save review to the product, review will not be created inside of review database
        const session = await Review.startSession();
        const { comment, rating } = req.body;
        // validate request:
        if (!(comment && rating)) {
            return res.status(400).send("All inputs are required");
        }
       
        // create review id manually because it is needed also for saving in Product collection
        const ObjectId = require("mongodb").ObjectId;
        let reviewId = new ObjectId();
        session.startTransaction();
        await Review.create([
            {
                _id: reviewId,
                comment: comment,
                rating: Number(rating),
                user: { _id: req.user._id, name: req.user.name + " " + req.user.lastName },
            }
        ],{ session: session })

        await session.commitTransaction();
        session.endSession();
        // save review id to product collection
       
        // res.send(product)
        let prc = [...product.reviews];
        prc.push({ rating: rating });
        product.reviews.push(reviewId);
        if (product.reviews.length === 1) {
            product.rating = Number(rating);
            
        } else {
            //The reduce method applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single output value. In this case, it's adding up all the elements of the array, starting from a sum of 0.
            let ratingCalc = prc.map((item) => Number(item.rating)).reduce((sum, item) => sum + item, 0) / product.reviews.length;
            product.rating = Math.round(ratingCalc);
        }
        product.reviewsNumber = product.reviews.length;
        console.log(product.reviews)
        await product.save();

        res.send('review created')
    } catch (err) {
        next(err)   
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("name lastName email isAdmin").orFail();
        return res.send(user);
    } catch (err) {
       next(err); 
    }
}

const updateUser = async (req, res, next) => {
    try {
       const user = await User.findById(req.params.id).orFail(); 

        user.name = req.body.name || user.name;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin ;

        await user.save();

        res.send("user updated");

    } catch (err) {
       next(err); 
    }
}

const deleteUser = async (req, res, next) => {
    try {
       await User.findByIdAndDelete(req.params.id);
       res.send("user removed");
    } catch (err) {
        next(err);
    }
}

module.exports = { getUsers, registerUser, loginUser, updateUserProfile, getUserProfile, writeReview, getUser, updateUser, deleteUser };
