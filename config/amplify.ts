import { env } from "@/config/env";
import { AmplifyStateType, AmplifyActionType } from "@/types";

// #region Initial State
export const INITIAL_AMPLIFY_AUTH_STATE: AmplifyStateType = {
  accessToken: { payload: {} },
  idToken: { payload: {} },
  loading: {
    isLoading: true,
    isLogoutLoading: false,
    isOtpLoading: false,
  },
  isUserAuthenticated: false,
  signInDetails: undefined,
  userId: "",
  username: "",
  isOtpSent: false,
  otpUsername: "",
  otpError: null,
};
// #endregion Initial State

// Amplify configuration
export const amplifyConfig = {
  // Amplify environment variables
  aws_project_region: env.AMP_PROJECT_REGION,
  aws_cognito_region: env.AMP_COGNITO_REGION,
  aws_user_pools_id: env.AMP_USER_POOLS_ID,
  aws_user_pools_web_client_id: env.AMP_USER_POOLS_WEB_CLIENT_ID,
  aws_appsync_region: env.AMP_APPSYNC_REGION,
  aws_appsync_authenticationType: env.AMP_APPSYNC_AUTHENTICATION_TYPE,

  // Other Amplify configuration
  oauth: {},
  aws_cognito_login_mechanisms: ["EMAIL"],
  aws_cognito_signup_attributes: ["EMAIL", "NAME"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      "REQUIRES_LOWERCASE",
      "REQUIRES_UPPERCASE",
      "REQUIRES_NUMBERS",
      "REQUIRES_SYMBOLS",
    ],
  },
};

// Reducer for the Amplify context
export const authReducer = (
  state: AmplifyStateType,
  action: AmplifyActionType,
): AmplifyStateType => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, ...action.payload };
    case "SET_LOADING":
      return {
        ...state,
        loading: { ...state.loading, ...action.payload },
      };
    case "SET_OTP":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
