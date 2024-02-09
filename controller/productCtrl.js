const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify")


// create product
const createProduct = asyncHandler(async (req, res) => {
    if(req.body.title){
        req.body.slug = slugify(req.body.title)
    }
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
        new: true,
      });
      res.json(updateProduct);
    } catch (error) {
      throw new Error(error);
    }
  });
// delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    
    try {
     
      const deleteProduct = await Product.findByIdAndDelete(id)
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  });
  



// get single product
const getaProduct= asyncHandler(async(req, res) =>{
 
    const {id} = req.params;
    try{

const findProduct = await Product.findById(id)
res.json(findProduct)
    }
    catch(error){
        throw new Error(error)
    }
})





// get all product
const getallProduct = asyncHandler(async (req, res) =>{

  // FIltering
    try{
const queryObj = {...req.query };
const excludeFields = ["page", "sort", "limit", "fields"];
excludeFields.forEach((el) => delete queryObj[el]);


let queryStr =JSON.stringify(queryObj)
queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);


let query = Product.find(JSON.parse(queryStr));

// Sorting
if (req.query.sort) {
  const sortBy = req.query.sort.split(",").join(" ");
  query = query.sort(sortBy);
} else {
  query = query.sort("-createdAt");
}

// limiting the fields

if (req.query.fields) {
  const fields = req.query.fields.split(",").join(" ");
  query = query.select(fields);
} else {
  query = query.select("-__v");
}

// Pagination
const page = req.query.page;
const limit = req.query.limit;
const skip = (page - 1) * limit;
query = query.skip(skip).limit(limit);

if (req.query.page) {
  const productCount = await Product.countDocuments();
  if (skip >= productCount) throw new Error("This Page does not exists");
}

const product = await query;
res.json(product);
    }
    catch(error){
        throw new Error(error)
    }
})
module.exports = { createProduct, getaProduct, getallProduct, updateProduct, deleteProduct };
