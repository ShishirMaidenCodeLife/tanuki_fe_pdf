"use client";

import { Spinner as SP, SpinnerProps } from "@heroui/spinner";

import { Container, HappyPineapple } from "@/components";

export const Spinner = (props: SpinnerProps) => {
  return <SP {...props} />;
};

export const HeaderSpinner = (props: SpinnerProps) => {
  return (
    <SP
      className="tracking-wide text-highlight -translate-x-3"
      classNames={{
        // wrapper: "w-[116px] h-[116px]",
        // wrapper: "w-[100px] h-[100px] mb-[3.75rem]",
        circle1: "border-[3px]",
        circle2: "border-[3px]",
        // spinnerBars: "bg-red-300",
        // dots: "bg-blue-400 text-red-300",
      }}
      color="current"
      size="sm"
      {...props}
    />
  );
};

export const CommonSpinner = (props: SpinnerProps) => {
  return (
    <Container isCenter isDimensionCommon>
      <SP
        className="large -translate-y-0.5 tracking-wide"
        size="lg"
        {...props}
      />
    </Container>
  );
};

export const HappyPineappleSpinner = (props: SpinnerProps) => {
  return (
    <Container isCenter isDimensionCommon>
      <SP
        className="-translate-y-0.5 text-highlight tracking-wide"
        classNames={{
          wrapper: "w-[116px] h-[116px]",
          // wrapper: "w-[100px] h-[100px] mb-[3.75rem]",
          circle1: "border-[10px]",
          circle2: "border-[10px]",
          // spinnerBars: "bg-red-300",
          // dots: "bg-blue-400 text-red-300",
        }}
        color="current"
        {...props}
      />
      <HappyPineapple extendCss="-translate-x-14 translate-y-7" />
    </Container>
  );
};

export const CardHappyPineapple = () => {
  return (
    <Container
      // isCenter
      extendCss="z-modal absolute inset-0 top-1/2 flex items-center justify-center translate-y-[5.5rem]"
    >
      <HappyPineapple />
    </Container>
  );
};

export const RouteCardSpinner = (props: SpinnerProps) => {
  return (
    <SP
      className="absolute right-4 translate-y-2 text-highlight tracking-wide"
      classNames={{
        wrapper: "w-[16px] h-[16px]",
        // wrapper: "w-[100px] h-[100px] mb-[3.75rem]",
        circle1: "border-[10px]",
        circle2: "border-[10px]",
        // spinnerBars: "bg-red-300",
        // dots: "bg-blue-400 text-red-300",
      }}
      color="current"
      {...props}
    />
  );
};

// export const HappyPineappleSpinner = (props: SpinnerProps) => {
//   return (
//     <Container isCenter isDimensionCommon>
//       <SP
//         className="-translate-y-0.5 tracking-wide"
//         classNames={{
//           wrapper: "w-[116px] h-[116px]",
//           // wrapper: "w-[100px] h-[100px] mb-[3.75rem]",
//           circle1: "border-[10px]",
//           circle2: "border-[10px]",
//           // spinnerBars: "bg-red-300",
//           // dots: "bg-blue-400 text-red-300",
//         }}
//         {...props}
//       />
//       <HappyPineapple />
//     </Container>
//   );
// };
