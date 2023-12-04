const express = require("express");
const fileUpload = require("express-fileupload")
const cookieParser = require("cookie-parser")
const cors = require('cors');
const app = express();
const port = 5050;


app.use(express.json())
app.use(cookieParser())
app.use(cors());
app.use(fileUpload())

const apiRoutes = require("./routes/apiRoutes");

app.get("/", async (req, res, next) => {
  res.json({ message: "API running..." });
});

// mongodb connection
const connectDB = require("./config/db");
connectDB();

app.use("/api", apiRoutes);


app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
      res.status(500).json({
         message: error.message, 
      })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


 //app.use is middleware which help doing something before loading  the function next to it