const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const { upload } = require('./common/common');
const itemRoutes = require("./routes/itemsRoute");
const batchRoutes = require("./routes/batchRoute");
const categoryRoutes = require("./routes/categoryRoute");
const subcategoryRoutes = require("./routes/subcategoryRoute");
const instructorRoutes = require("./routes/instructorRoute");
const courseRoutes = require("./routes/courseRoute");
const studentRoutes = require("./routes/studentRoute");
const myclassRoutes = require("./routes/myclassRoute");
const authRoutes = require("./routes/authRoute");
const MaterialLinkRoutes = require("./routes/materiallinkRoute");



const Item = require("./Models/Items"); // Ensure the path is correct


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));
// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


//Routes

app.use("/api/items", itemRoutes);
app.use("/api/batch", batchRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/myclass", myclassRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/materialLink", MaterialLinkRoutes);


// Route for single file upload
app.post('/api/upload-single', upload.single('file'), (req, res) => {
  if (req.file) {
    res.send({
      message: 'Single file uploaded successfully!',
      file: `uploads/${req.file.filename}`
    });
  } else {
    res.status(400).send('No file uploaded or invalid file type.');
  }
});

// Route for multiple file uploads
app.post('/api/upload-multiple', upload.array('files', 10), (req, res) => {
  if (req.files) {
    let fileNames = req.files.map(file => `uploads/${file.filename}`);
    res.send({
      message: 'Multiple files uploaded successfully!',
      files: fileNames
    });
  } else {
    res.status(400).send('No files uploaded or invalid file type.');
  }
});
app.get('/',(req,res)=>{
  return res.json({message:"all good"})
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
