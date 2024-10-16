const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Ecommerce')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API Creation
app.get("/", (req, res) => {
  res.send("express app is running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Static folder for serving images
app.use('/images', express.static("upload/images"));

// Upload endpoint
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Define Product model
const Product = mongoose.model("Product", {
  id: {
    type: Number,
//    required: true,
 },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,  // Ensure image path is saved correctly
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  }
});

// Add product endpoint
app.post('/addproduct',async(req,res)=>{
  let products=await Product.find({});
  
  let id;
  if(products.length>0)
  {
    let last_product_array= products.slice(-1);
    let last_product= last_product_array[0];
    id =last_product.id+1;
  }
  const product= new Product({
    id:req.body.id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,

  });
  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success:true,
    name:req.body.name,
  })

})

//creating Api for removing products
app.post('/removeproduct',async(req,res)=>{
  await Product.findOneAndDelete({id:req.body.id});
  console.log("Removed");
  res.json({
    success:true,
    name:req.body.name
  })
})

//schema creating for User model
const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData:{
    type:Object,
  },
  date:{
    type:Date,
    default:Date.now,
  }
});
//creating endpoint for user registration
app.post('/signup',async(req,res)=>{
  let check=await Users.findOne({email:req.body.email});
  if(check){
    return res.status(400).json({success:false,errors:"existing user found with same email"})
    }
    let cart = {};
for (let i = 0; i < 300; i++) {
  cart[i] = 0;
}

const user = new Users({
  name: req.body.username,
  email: req.body.email,
  password: req.body.password,
  cartData: cart,
});

await user.save(); 

const data={
  user:{
    id:user.id
  }
}
const token=jwt.sign(data,'secret_ecom');
res.json({success:true,token})
})

//creating Api for getting all products
app.get('/allproducts',async(req,res)=>{
  let products= await Product.find({});
  console.log("All products fetched");
  res.send(products);
})
// Start the server
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server is running on port ${port}`);
  } else {
    console.error('Failed to start server:', error);
  }
});
