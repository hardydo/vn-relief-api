import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import VARIABLE_GLOBAL from "./src/variables/global.js";
import DBconnect from "./src/databases/connection/connection.js";
import CombineRoute from "./src/routes/index.js";

// import errorMiddleware from "./middlewares/error.middleware.js";
// import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = VARIABLE_GLOBAL.BE_PORT || 8800;

app.use(
  cors({
    credentials: true, // Cho phép gửi cookie
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://testcookie.com:3000",
      "https://socialmedia254.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//connect db
DBconnect()

//
// const a = 1,
//   b = null,
//   c = null,
//   d = null;
// if (!(a && b && c && d)) console.log("hehe");

app.use(cookieParser());
app.use(helmet());
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//routes
CombineRoute.forEach((route)=> {
  app.use(route)
})

app.get("/", (req, res, next) => {
  res.send({
    status: 200,
    message: "BACKEND VNRELIEF @cre: dwchau.dev@gmail.com",
  });
});

// app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("========= SERVER RUNNING =========")
  console.log("|| Server running on port:", PORT, "||");
  console.log("==================================")
});
