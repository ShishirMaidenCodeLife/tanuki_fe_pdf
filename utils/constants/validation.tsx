import { FORM_ERROR_MESSAGES } from "@/utils/constants/messages";
import { ROUTES_VALUE_REGEX_PATTERN } from "@/utils/constants/regex";
import { validateRoutesLength } from "@/utils/methods/app";

const formValidation = {
  name: {
    required: FORM_ERROR_MESSAGES.name.required,
    minLength: {
      value: 3,
      message: FORM_ERROR_MESSAGES.name.minLength,
    },
    maxLength: {
      value: 100,
      message: FORM_ERROR_MESSAGES.name.maxLength,
    },
    validate: {
      noNumbers: (value: string) =>
        /^[A-Za-z\s]+$/.test(value) || FORM_ERROR_MESSAGES.name.invalid,
    },
  },
  email: {
    required: FORM_ERROR_MESSAGES.email.required,
    maxLength: {
      value: 254,
      message: FORM_ERROR_MESSAGES.email.maxLength,
    },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: FORM_ERROR_MESSAGES.email.invalid,
    },
  },
  otpSixDigit: {
    required: FORM_ERROR_MESSAGES.otp.required,
    pattern: {
      value: /^\d{6}$/, // Matches exactly 6 digits
      message: FORM_ERROR_MESSAGES.otp.invalidLength,
    },
  },
  phoneNumber: {
    required: FORM_ERROR_MESSAGES.phone.required,
    pattern: {
      value: /^\+\d{1,3}\d{7,14}$/,
      message: FORM_ERROR_MESSAGES.phone.invalid,
    },
  },
  password: {
    required: FORM_ERROR_MESSAGES.password.required,
    minLength: {
      value: 8,
      message: FORM_ERROR_MESSAGES.password.minLength,
    },
    maxLength: {
      value: 100,
      message: FORM_ERROR_MESSAGES.password.maxLength,
    },
    pattern: {
      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      message: FORM_ERROR_MESSAGES.password.invalid,
    },
  },
  confirmSignupPassword: {
    required: FORM_ERROR_MESSAGES.confirmPassword.required,
    minLength: {
      value: 8,
      message: FORM_ERROR_MESSAGES.password.minLength,
    },
    maxLength: {
      value: 100,
      message: FORM_ERROR_MESSAGES.password.maxLength,
    },
    pattern: {
      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      message: FORM_ERROR_MESSAGES.password.invalid,
    },
    validate: (value: string, context: { password: string }) =>
      value === context.password ||
      FORM_ERROR_MESSAGES.confirmPassword.mismatch,
  },
  routesValue: {
    required: FORM_ERROR_MESSAGES.routesValue.required,
    pattern: {
      value: ROUTES_VALUE_REGEX_PATTERN,
      message: FORM_ERROR_MESSAGES.routesValue.incorrectFormat,
    },
    validate: (value: string) => validateRoutesLength(value),
  },
};

export { formValidation };
