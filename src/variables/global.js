import dotenv from "dotenv";
dotenv.config();
const ENV = process.env;

const VARIABLE_GLOBAL = {
    MONGO_URI_DEV: ENV.MONGO_URI_DEV,
    MONGO_URI_PRODUCTION: ENV.MONGO_URI_PRODUCTION,
    NODE_ENV: ENV.NODE_ENV,
    BE_PORT: ENV.BE_PORT
}

export default VARIABLE_GLOBAL