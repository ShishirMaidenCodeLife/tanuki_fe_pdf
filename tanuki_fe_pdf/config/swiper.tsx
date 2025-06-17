export const DASHBOARD_SWIPER = (showSwiperNav?: boolean) => ({
  breakpoints: {
    320: {
      slidesPerView: 2,
      spaceBetween: 16,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 28,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 32,
    },
    1280: {
      slidesPerView: 5,
      spaceBetween: 36,
    },
  },
  centeredSlides: showSwiperNav,
  // className: "relative h-[250px]",
  draggable: showSwiperNav,
  keyboard: { enabled: showSwiperNav },
  // loop:false,
  loop: showSwiperNav,
  navigation: showSwiperNav,
  // pagination: {{
  //   clickable: true,
  //   dynamicBullets: true,
  //   // horizontalClass: "!bottom-[-32px]",
  //   verticalClass: "bg-blue-300",
  //   // bulletClass: "w-[50px] h-[20px] bg-highlight",
  //   // clickableClass: "bg-green-300",
  //   // currentClass: "bg-yellow-300",
  //   // modifierClass: "-bottom-5",
  //   // bulletClass: "bg-purple-300",

  //   renderBullet: function (index: number, className: string) {
  //     return '<span class:"' + className + '">' + (index + 1) + "</span>";
  //   },
  // }},
  // slidesPerView:{5}
  // spaceBetween:{25}
});
