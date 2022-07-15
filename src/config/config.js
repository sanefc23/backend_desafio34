const denv = require('dotenv');

denv.config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    MONGO_ATLAS_URL: process.env.MONGO_ATLAS_URL
};
