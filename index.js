const express = require("express");
const cors = require("cors");
const dbConnection = require("./Database/Connection");
const dotenv = require("dotenv");
const { gameTimer } = require("./cron/cron");
const { ErrorResponse } = require("./Error/Utils");

const app = express();
dotenv.config();
app.use(cors());

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ limit: "500mb", extended: true }));

//PORT:
let port = process.env.PORT || 2000;

//DATABASE CONNECTION:
dbConnection();

//MULTER SETUP
app.use("/images", express.static("./images"));

//------------------API ---------------------

//SETTER ROUTES
app.use("/api/v1/setter", require("./Routes/Setter/setterRoutes"));
app.use("/api/v1/game", require("./Routes/Setter/gameRoutes"));

//GETTER ROUTES
app.use("/api/v1/getter", require("./Routes/Getter/getterRoutes"));
app.use("/api/v1/credit", require("./Routes/Getter/creditRoutes"));

//ADMIN ROUTES
app.use("/api/v1/admin", require("./Routes/Admin/adminRoutes"));

//REWARDS
app.use("/api/v1/rewards", require("./Routes/Rewards/reward"));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ErrorResponse("API Not found", 404));
});

//CUSTOM ERROR HANDLING
app.use(require("./Error/Error"));

gameTimer();

//PORT LISTENING:
app.listen(port, () => console.log(`server is runing on port ${port}`));
