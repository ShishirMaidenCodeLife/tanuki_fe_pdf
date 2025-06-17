// export type DashboardCardType = {
//   title: string;
//   updatedAt: string;
//   image: string;
//   children?: DashboardCardType[];
// };

export type LoginFormType = {
  email: string;
  password: string;
};

export type RegisterFormType = {
  name: string;
  email: string;
  password: string;
  otp: string;
  confirmSignupPassword: string;
};

export type RoutesFormBuilderType = {
  routesValue: string;
};

export type VerifyOtpFormType = {
  otp: string;
};

// export type DashboardCardRoutesType = {
//   companyRoutes: DashboardCardType[];
//   yourRoutes?: DashboardCardType[];
// };
