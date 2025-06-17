import { createToast } from "@/utils/methods/style";

// Error Messages for Form Validation
export const FORM_ERROR_MESSAGES = {
  name: {
    required: "Name is required.",
    minLength: "Name must be at least 3 characters long.",
    maxLength: "Name must be at most 100 characters long.",
    invalid: "Name should only contain letters and spaces, no numbers allowed.",
  },
  email: {
    required: "Email is required.",
    maxLength: "Email cannot be longer than 254 characters.",
    invalid: "Invalid email address.",
  },
  otp: {
    required: "OTP is required.",
    invalidLength: "OTP must be exactly 6 digits long.",
  },
  phone: {
    required: "Phone number is required.",
    invalid:
      "Invalid phone number format. Use E.164 format (e.g., +1234567890).",
  },
  password: {
    required: "Password is required.",
    minLength: "Password must be at least 8 characters long.",
    maxLength: "Password must be at most 100 characters long.",
    invalid:
      "Password must include at least one uppercase letter, one number, and one special character.",
  },
  confirmPassword: {
    required: "Confirm password is required.",
    mismatch: "Passwords do not match.",
  },
  routesValue: {
    required: "Route values are required.",
    minRoutes:
      "Not enough routes! Please enter at least 3 routes to create a roadmap.",
    maxRoutes: "Too many route values! Please enter no more than 10 routes.",
    incorrectFormat:
      "Invalid input! Please ensure the route values are separated by commas.",
  },
};

export const PAGE_ERROR_MESSAGES = {
  amplify: {
    outOfBounds: "useAmplify must be used within a AmplifyProvider.",
  },
};

export const TOAST_MESSAGES = {
  api: {
    default: {
      requestTimedOut: createToast(
        "danger",
        "Request timed out.",
        "リクエストがタイムアウトしました。",
      ),
    },
    singleAiCall: {
      success: createToast(
        "success",
        "Displaying mindmap successfully.",
        "マインドマップを表示しています。",
      ),
    },
  },

  auth: {
    incorrectCredentials: createToast(
      "danger",
      "Incorrect username or password.",
      "ユーザー名またはパスワードが正しくありません。",
    ),

    login: {
      success: createToast(
        "success",
        "Login successful!",
        "ログインに成功しました！",
      ),
      failed: createToast(
        "danger",
        "Login failed. Please try again.",
        "ログインに失敗しました。もう一度お試しください。",
      ),
    },

    logout: {
      success: createToast(
        "success",
        "Logout successful!",
        "ログアウトに成功しました！",
      ),
      failed: createToast(
        "danger",
        "Logout failed. Please try again.",
        "ログアウトに失敗しました。もう一度お試しください。",
      ),
    },

    otp: {
      pleaseVerify: createToast(
        "primary",
        "Please verify the OTP sent to your email.",
        "あなたのメールに送信されたOTPを確認してください。",
      ),
      failed: createToast(
        "danger",
        "Failed to send OTP. Please try again.",
        "OTPの送信に失敗しました。もう一度お試しください。",
      ),
    },

    user: {
      verified: createToast(
        "success",
        "Account verified! Please login.",
        "アカウントが確認されました。ログインしてください。",
      ),
      alreadyExistsVerifyOtp: createToast(
        "primary",
        "User already exists. Please verify the OTP sent to your email.",
        "ユーザーはすでに存在します。メールに送信されたOTPを確認してください。",
      ),
      notFound: createToast(
        "danger",
        "User does not exist.",
        "ユーザーが存在しません。",
      ),
    },
  },

  // default
  default: {
    success: createToast(
      "success",
      "Operation completed successfully.",
      "操作が正常に完了しました。",
    ),
    failed: createToast(
      "danger",
      "Operation failed. Please try again.",
      "操作に失敗しました。もう一度お試しください。",
    ),
  },

  pages: {
    map: {
      centeredGraph: createToast(
        "success",
        "Centered the position of the graph.",
        "グラフの位置を中央に合わせました。",
      ),

      centeredAlready: createToast(
        "secondary",
        "Position has already been centered.",
        "位置はすでに中央に配置されています。",
      ),

      resetComplete: createToast(
        "success",
        "Page reset complete! You can now start fresh.",
        "ページのリセットが完了しました。これで新しく始めることができます。",
      ),

      resetAlready: createToast(
        "secondary",
        "Position has already been reset.",
        "位置はすでにリセットされています。",
      ),

      skillsCleared: createToast(
        "success",
        "Skills have been cleared.",
        "スキルはクリアされました。",
      ),

      noSkillsToClear: createToast(
        "warning",
        "No skills to clear.",
        "クリアするスキルがありません。",
      ),

      noSkillsToGenerate: createToast(
        "warning",
        "No skills to generate.",
        "生成するスキルがありません。",
      ),
    },
    displayRoute: {
      drag: {
        success: createToast(
          "success",
          "Swapped nodes successfully.",
          "ノードの位置を入れ替えました。",
        ),
        // failed: createToast(
        //   "danger",
        //   "Failed to swap nodes.",
        //   "ノードの位置を入れ替えることができませんでした。",
        // ),
        notCloseEnough: createToast(
          "warning",
          "Nodes are not close enough to swap.",
          "ノードが近すぎて入れ替えることができません。",
        ),
        differentGroup: createToast(
          "warning",
          "Nodes are in different groups and cannot be swapped.",
          "ノードが異なるグループにあり、入れ替えることができません。",
        ),
        sameGroupDifferentGrandparent: createToast(
          "warning",
          "Nodes are in the same group but different grandparent groups.",
          "ノードは同じグループにありますが、異なる祖父グループにあります。",
        ),
        sameGroupDifferentParent: createToast(
          "warning",
          "Nodes are in the same group but different parent groups.",
          "ノードは同じグループにありますが、異なる親グループにあります。",
        ),
      },
    },
  },

  network: {
    noInternet: createToast(
      "danger",
      "Could not connect to the internet.",
      "リクエストがタイムアウトしました。",
    ),
  },

  route: {
    incorrectCredentials: createToast(
      "success",
      "Displaying mindmap successfully.",
      "マインドマップを表示しています。",
    ),
  },

  statusCode: {
    // Success
    200: createToast(
      "success",
      "The operation was completed successfully.",
      "操作が正常に完了しました。",
    ),

    400: createToast(
      "danger",
      "There seems to be an issue with your input. Please check and try again.",
      "入力に問題があります。確認して再試行してください。",
    ),
    401: createToast(
      "danger",
      "You need to log in to access this page. Please log in and try again.",
      "このページにアクセスするにはログインが必要です。ログインして再試行してください。",
    ),
    403: createToast(
      "danger",
      "Access forbidden. You do not have permission to view this page.",
      "アクセスが禁止されています。権限がありません。",
    ),
    404: createToast(
      "danger",
      "The requested resource could not be found. Please try again.",
      "リソースが見つかりませんでした。再試行してください。",
    ),
    500: createToast(
      "danger",
      "Something went wrong on our end. Please try again later.",
      "サーバーエラーが発生しました。後でもう一度お試しください。",
    ),
    502: createToast(
      "danger",
      "There was an issue connecting to the server. Please check the server status.",
      "サーバーへの接続に問題が発生しました。サーバーの状態を確認してください。",
    ),
    503: createToast(
      "danger",
      "The service is temporarily unavailable. Please try again later.",
      "サービスが一時的に利用できません。後でもう一度お試しください。",
    ),
  },

  // // Warnings
  // 429: createToast(
  //   "warning",
  //   "You have exceeded the rate limit. Please slow down.",
  //   "レート制限を超えました。少しお待ちください。",
  // ),
};
