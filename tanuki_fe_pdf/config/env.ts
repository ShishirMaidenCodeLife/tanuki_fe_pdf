export const env = {
  // #region Default & Custom
  // TEST_MODE: "development",
  // TEST_MODE: "testing",

  // NODE_ENVIRONMENT: process.env.NODE_ENV as "development" | "production",
  TENGU_MODE: process.env.TENGU_MODE,
  API_TIMEOUT: process.env.API_TIMEOUT,
  // #endregion Default & Custom

  // #region Images
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  FIGMA_URL: process.env.FIGMA_URL,
  // #endregion Images

  // #region Main tengu apis
  TENGU_BASE_URL: process.env.TENGU_BASE_URL,
  TENGU_BASE_TEST_URL: process.env.TENGU_BASE_TEST_URL,
  // #endregion Main tengu apis

  // #region Amplify Cognito
  AMP_PROJECT_REGION: process.env.AMP_PROJECT_REGION,
  AMP_COGNITO_REGION: process.env.AMP_COGNITO_REGION,
  AMP_USER_POOLS_ID: process.env.AMP_USER_POOLS_ID,
  AMP_USER_POOLS_WEB_CLIENT_ID: process.env.AMP_USER_POOLS_WEB_CLIENT_ID,
  AMP_APPSYNC_REGION: process.env.AMP_APPSYNC_REGION,
  AMP_APPSYNC_AUTHENTICATION_TYPE: process.env.AMP_APPSYNC_AUTHENTICATION_TYPE,
  // #endregion Amplify Cognito
};

// Ensure required environment variables are set
// if (!env.HEROUI_KEY) {
//   throw new Error("Missing HEROUI_KEY in environment variables.");
// }
