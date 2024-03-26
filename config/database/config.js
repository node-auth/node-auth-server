require('dotenv').config();
// we use require if this file is not linked to the main file

module.exports = {
  development: {
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST_NAME,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    // dialectOptions: {
    //   bigNumberStrings: true,
    //   ssl: {
    //     ca: process.env.CA_CERT,
    //   }
    // }
  },
  test: {
    use_env_variable: process.env.DB_CONNECTION_STRING,
    dialect: process.env.DB_DIALECT,
    // dialectOptions: {
    //   bigNumberStrings: true,
    //   ssl: {
    //     ca: process.env.CA_CERT,
    //   }
    // }
  },
  production: {
    use_env_variable: process.env.DB_CONNECTION_STRING,
    dialect: process.env.DB_DIALECT,
    // dialectOptions: {
    //   bigNumberStrings: true,
    //   ssl: {
    //     ca: process.env.CA_CERT,
    //   }
    // }
  }
}