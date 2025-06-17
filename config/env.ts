export const env = {
  // #region Default & Custom
  // TEST_MODE: "development",
  // TEST_MODE: "testing",

  // NODE_ENVIRONMENT: process.env.NODE_ENV as "development" | "production",
  FE_MODE: process.env.FE_MODE,
  FE_TIMEOUT: process.env.FE_TIMEOUT,
  // #endregion Default & Custom

  // #region Images
  FE_CLOUDINARY_URL: process.env.FE_CLOUDINARY_URL,
  // #endregion Images

  // #region Main tengu apis
  FE_BACKEND_BASE_URL: process.env.FE_BACKEND_BASE_URL,
  FE_LOCAL_TEST_URL: process.env.FE_LOCAL_TEST_URL,
  // #endregion Main tengu apis

  // #region Amplify Cognito
  FE_PROJECT_REGION: process.env.FE_PROJECT_REGION,
  FE_COGNITO_REGION: process.env.FE_COGNITO_REGION,
  FE_USER_POOLS_ID: process.env.FE_USER_POOLS_ID,
  FE_USER_POOLS_WEB_CLIENT_ID: process.env.FE_USER_POOLS_WEB_CLIENT_ID,
  FE_APPSYNC_REGION: process.env.FE_APPSYNC_REGION,
  FE_APPSYNC_AUTHENTICATION_TYPE: process.env.FE_APPSYNC_AUTHENTICATION_TYPE,
  // #endregion Amplify Cognito
};

// Validate required environment variables for production/staging
if (typeof window === "undefined") {
  // Only run on server side
  const feMode = env.FE_MODE;
  const isProduction = feMode === "production" || feMode === "staging";

  if (isProduction) {
    const requiredVars = [
      "FE_USER_POOLS_ID",
      "FE_USER_POOLS_WEB_CLIENT_ID",
      "FE_PROJECT_REGION",
      "FE_COGNITO_REGION",
      "FE_APPSYNC_REGION",
    ] as const;

    const missingVars = requiredVars.filter((varName) => !env[varName]);

    if (missingVars.length > 0) {
      console.error(
        `❌ Missing required environment variables for ${feMode}:`,
        missingVars,
      );
      console.error(
        "Please ensure these are configured in your deployment environment",
      );
      // In production, we might want to throw an error, but for now just log
      // throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    } else {
      console.log(
        `✅ All required environment variables are present for ${feMode}`,
      );
    }
  }
}
