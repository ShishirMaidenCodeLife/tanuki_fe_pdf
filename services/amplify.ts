import { AuthSession, GetCurrentUserOutput } from "@aws-amplify/auth";

import { AmplifyActionType } from "@/types";

// Set the user state as per the amplify user
export const getAmplifyUserState = (
  user: GetCurrentUserOutput,
  session: AuthSession,
): AmplifyActionType => {
  return {
    type: "SET_USER",
    payload: {
      username: user.username ?? "",
      userId: user.userId ?? "",
      signInDetails: {
        loginId: user.signInDetails?.loginId ?? "",
        authFlowType: user.signInDetails?.authFlowType ?? "",
      },
      isUserAuthenticated: true,
      idToken: session.tokens?.idToken ?? { payload: {} },
      accessToken: session.tokens?.accessToken ?? { payload: {} },
    },
  };
};

export const getOtpState = (username: string) => {
  return {
    type: "SET_OTP_SENT",
    payload: { username, isOtpSent: true },
  };
};
