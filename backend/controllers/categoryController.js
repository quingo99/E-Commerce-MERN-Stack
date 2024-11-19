const Category = require("../models/CategoryModel");

const getCategories = async (req, res, next) => {
  //Product.create({name: "Panasonic"})
  try {
    const categories = await Category.find({}).sort({ name: "asc" }).orFail();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};
const newCategory = async (req, res, next) => {
  try {
    console.log(req.body);
    //res.send(!!req.body)
    const { category } = req.body;
    if (!category) {
      res.status(400).send("Category input is required");
    }
    const categoryExists = await Category.findOne({ name: category });
    if (categoryExists) {
      res.status(400).send("Category already exist");
    } else {
      const categoryCreated = await Category.create({
        name: category,
      });
      res.status(201).send({ categoryCreated: categoryCreated });
    }
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
    try {
        console.log(req.params.category); 
      if (req.params.category !== "Choose category") {
        // Find the category by name
        const categoryExists = await Category.findOne({
          name: decodeURIComponent(req.params.category),
        }).orFail(); // Ensure the category exists or fail
  
        // Delete the category
        await Category.deleteOne({ _id: categoryExists._id });
  
        // Fetch all remaining categories sorted by name after deletion
        const remainingCategories = await Category.find({}).sort({ name: 'asc' });
  
        // Return the response with the remaining categories
        res.json({ categoryDeleted: true, remainingCategories });
      } else {
        // Handle the case where "Choose category" is passed
        res.status(400).json({ error: "Invalid category: Choose a valid category to delete" });
      }
    } catch (err) {
      // Pass errors to the error handling middleware
      next(err);
    }
  };
  

const saveAttr = async (req, res, next) => {
  const { key, val, categoryChosen } = req.body;

  if (!key || !val || !categoryChosen) {
    return res.status(400).send("All inputs are required");
  }

  try {
    const category = categoryChosen.split("/")[0];

    const categoryExists = await Category.findOne({ name: category }).orFail();

    if (categoryExists.attrs.length > 0) {
      let keyDoesNotExistsInDatabase = true;

      categoryExists.attrs.map((item, idx) => {
        if (item.key === key) {
          keyDoesNotExistsInDatabase = false;
          let copyAttributeValue = [...categoryExists.attrs[idx].value];

          copyAttributeValue.push(val);

          // Ensure unique values
          let newAttributeValue = [...new Set(copyAttributeValue)];
          categoryExists.attrs[idx].value = newAttributeValue;
        }
      });

      if (keyDoesNotExistsInDatabase) {
        categoryExists.attrs.push({ key: key, value: [val] });
      }
    } else {
      categoryExists.attrs.push({ key: key, value: [val] });
    }

    await categoryExists.save();

    let cat = await Category.find({}).sort({ name: "asc" });

    return res.status(201).json({ categoryUpdated: cat });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, newCategory, deleteCategory, saveAttr };
