const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {
  console.error(e)
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7001"
// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000"

const DATABASE_TYPE = process.env.DATABASE_TYPE || "postgres";
const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/medusa-store";
const REDIS_URL = process.env.REDIS_URL;

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-file-spaces`,
    options: {
      spaces_url: process.env.SPACE_URL,
      bucket: process.env.SPACE_BUCKET,
      endpoint: process.env.SPACE_ENDPOINT,
      access_key_id: process.env.SPACE_ACCESS_KEY_ID,
      secret_access_key: process.env.SPACE_SECRET_ACCESS_KEY,
    },
  },
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      // capture: true,
    },
  },
  {
    resolve: `medusa-payment-paypal`,
    options: {
      sandbox: process.env.SANDBOX,
      // sandbox: process.env.PAYPAL_SANDBOX,
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
      auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID,
    },
  },

];

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  database_database: "./medusa-db.sql",
  database_type: DATABASE_TYPE,
  store_cors: STORE_CORS,
  admin_cors: ADMIN_CORS,
  // redis_url: REDIS_URL,
  cli_migration_dirs: [
    'node_modules/external-module/dist/**/*.migration.js',
    'dist/**/*.migration.js'
  ],
  // Uncomment the following lines to enable REDIS
  // redis_url: REDIS_URL,
}


if (DATABASE_URL && DATABASE_TYPE === "postgres") {
  projectConfig.database_url = DATABASE_URL;
  delete projectConfig["database_database"];
  projectConfig['database_extra'] =
    process.env.NODE_ENV !== "development"
      ? { ssl: { rejectUnauthorized: false } }
      : {};
}


/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  featureFlags: {
    product_categories: true,
  },
  plugins,
};
