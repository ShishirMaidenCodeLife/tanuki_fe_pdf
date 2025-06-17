"use client";

import clsx from "clsx";

import { PageContainer, FullPageContainer } from "@/components";
// import { useRouteTemplateApiService } from "@/hooks";
// import { generateUniqueId } from "@/utils/methods/string";

const RouteTemplatesGallery = () => {
  // const data = useRouteTemplateApiService(["useGetByCategory"]);
  return (
    <section
      className={clsx(
        "route-gallery-section",
        "relative flex flex-col gap-4 apply_height py-10",
      )}
    >
      <div className="section-title text-2xl font-bold text-center">
        Route Template Gallery
      </div>
      {/* {data?.companyRoutes?.map((item: DashboardCardType, index: number) => (
        <CategoryCard
          key={generateUniqueId(index, item.title)}
          {...item}
        />
      ))} */}
    </section>
  );
};

export const RouteTemplatesPageClient = () => {
  return (
    <FullPageContainer>
      <PageContainer
        className={clsx(
          "route-templates-page",
          "relative w-full apply_height _apply_common_padding flex-col",
        )}
      >
        <RouteTemplatesGallery />
      </PageContainer>
    </FullPageContainer>
  );
};
