import { PrivateLayout } from "@/components";
import { ChildrenType } from "@/types";

export default function DashboardLayout({ children }: ChildrenType) {
  return <PrivateLayout>{children}</PrivateLayout>;
}
