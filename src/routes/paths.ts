import { kebabCase } from "es-toolkit";
import { _id, _postTitles } from "@/_mock/assets";

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  about: "/about-us",
  contact: "/contact-us",
  faqs: "/faqs",
  page403: "/error/403",
  page404: "/error/404",
  page500: "/error/500",
  cooperativeBound: "/error/cooperative-bound",
  components: "/components",
  docs: "https://docs.minimals.cc",
  changelog: "https://docs.minimals.cc/changelog",
  zoneStore: "https://mui.com/store/items/zone-landing-page/",
  minimalStore: "https://mui.com/store/items/minimal-dashboard/",
  freeUI: "https://mui.com/store/items/minimal-dashboard-free/",
  figmaUrl:
    "https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0",
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
    signOut: `${ROOTS.AUTH}/sign-out`,
    /** OAuth (authorization code + PKCE) redirect target. */
    callback: `${ROOTS.AUTH}/callback`,
  },
  onboarding: "/onboarding",
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit` },
    },

    // ---- POS paths ----
    overview: {
      root: `${ROOTS.DASHBOARD}`,
    },
    analytics: {
      root: `${ROOTS.DASHBOARD}/analytics`,
    },
    inventory: {
      root: `${ROOTS.DASHBOARD}/inventory`,
      list: `${ROOTS.DASHBOARD}/inventory/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/inventory/${id}`,
      create: `${ROOTS.DASHBOARD}/inventory/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/inventory/${id}/edit`,
      categories: `${ROOTS.DASHBOARD}/inventory/categories`,
    },
    orders: {
      root: `${ROOTS.DASHBOARD}/orders`,
      list: `${ROOTS.DASHBOARD}/orders/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/orders/${id}`,
      create: `${ROOTS.DASHBOARD}/orders/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/orders/${id}/edit`,
    },
    customers: {
      root: `${ROOTS.DASHBOARD}/customers`,
      list: `${ROOTS.DASHBOARD}/customers/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/customers/${id}`,
      create: `${ROOTS.DASHBOARD}/customers/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/customers/${id}/edit`,
    },
    invoices: {
      root: `${ROOTS.DASHBOARD}/invoices`,
      list: `${ROOTS.DASHBOARD}/invoices/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoices/${id}`,
      create: `${ROOTS.DASHBOARD}/invoices/create`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoices/${id}/edit`,
    },
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
    },
  },

  // product
  product: {
    root: "/product",
    demo: { details: "/product/1" },
    checkout: "/product/checkout",
    details: (id: string) => `/product/${id}`,
  },
};
