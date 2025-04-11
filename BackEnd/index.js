const express = require("express");
const app = express();
const errorHandler = require("express-async-error").Handler;
const path = require("path");
require("dotenv").config();

const cors = require("cors");
// DB connection
require("./db");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Requiring Routes
const usersRouter = require("./src/routes/usersRoutes");
const orderRouter = require("./src/routes/orderRoutes");
const wishlistRouter = require("./src/routes/wishlistRoutes");
const reviewRouter = require("./src/routes/reviewsRoutes");
const productRouter = require("./src/routes/productsRoutes");
const productCategoryRouter = require("./src/routes/productCategoryRoutes");
const productSubCategoryRouter = require("./src/routes/productSubCategoryRoutes");
const cartRouter = require("./src/routes/cartRoutes");


const verifyToken = require("./src/utils/verifyToken");

app.use(
  cors({
    origin: "*", // Allow all origins (you can specify frontend URL instead)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// parsing incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// error handler over any async function
app.use(errorHandler());

// Routes
app.use("/users", usersRouter);
app.use("/orders", orderRouter);
app.use("/wishlists", wishlistRouter);
app.use("/reviews", reviewRouter);
app.use("/products", productRouter);
app.use("/product-category", productCategoryRouter);
app.use("/product-sub-category", productSubCategoryRouter);
app.use("/carts", cartRouter);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    status: statusCode,
    message: err?.message || "Internal Server Error!",
    errors: err?.errors || [],
  });
});

// app.listen(+process.env.PORT, (error) => {
//   if (!error)
//     console.log(
//       "Server is Successfully Running, and App is listening on port " +
//         +process.env.PORT
//     );
//   else console.log("Error occurred, server can't start", error);
// });
app.listen(+process.env.PORT1, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port1 " +
        +process.env.PORT1
    );
  else console.log("Error occurred, server can't start", error);
});

app.listen(+process.env.PORT2, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port2 " +
        +process.env.PORT2
    );
  else console.log("Error occurred, server can't start", error);
});