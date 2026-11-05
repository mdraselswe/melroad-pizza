export const ROUTES = {
  home: "/",
  menu: "/menu/",
  build: "/build/",
  deals: "/deals/",
  checkout: "/checkout/",
  order: (id: string) => `/order/?id=${encodeURIComponent(id)}`,
  rewards: "/rewards/",
  visit: "/visit/",
  credits: "/credits/",
} as const;
