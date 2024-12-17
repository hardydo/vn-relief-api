import VARIABLE_GLOBAL from "../../variables/global.js";

const NODE_ENV = VARIABLE_GLOBAL.NODE_ENV;
const ConfigDB =
  NODE_ENV === "production"
    ? {
        uri: VARIABLE_GLOBAL.MONGO_URI_PRODUCTION,
      }
    : NODE_ENV === "development"
    ? {
        uri: VARIABLE_GLOBAL.MONGO_URI_DEV,
      }
    : NODE_ENV === "test"
    ? {
        uri: VARIABLE_GLOBAL.MONGO_URI_DEV,
      }
    : null;

export default ConfigDB;
