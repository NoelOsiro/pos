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
  leave: {
    root: `/leave`,
    checkout: `/leave/checkout`,
    details: (id: string) => `/leave/${id}`,
    demo: { details: `/leave/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
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
    // MavunoFlow domain paths
    farmers: {
      root: `${ROOTS.DASHBOARD}/farmers`,
      list: `${ROOTS.DASHBOARD}/farmers/list`,
      new: `${ROOTS.DASHBOARD}/farmers/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/farmers/${id}/edit`,
    },
    agents: {
      root: `${ROOTS.DASHBOARD}/agents`,
      list: `${ROOTS.DASHBOARD}/agents/list`,
      new: `${ROOTS.DASHBOARD}/agents/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/agents/${id}/edit`,
    },
    farms: {
      root: `${ROOTS.DASHBOARD}/farms`,
      list: `${ROOTS.DASHBOARD}/farms/list`,
      new: `${ROOTS.DASHBOARD}/farms/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/farms/${id}/edit`,
    },
    collections: {
      root: `${ROOTS.DASHBOARD}/collections`,
      list: `${ROOTS.DASHBOARD}/collections/list`,
      new: `${ROOTS.DASHBOARD}/collections/new`,
      analytics: `${ROOTS.DASHBOARD}/collections/analytics`,
    },
    valuations: {
      root: `${ROOTS.DASHBOARD}/valuations`,
      list: `${ROOTS.DASHBOARD}/valuations/list`,
      new: `${ROOTS.DASHBOARD}/valuations/new`,
    },
    pricelists: {
      root: `${ROOTS.DASHBOARD}/pricelists`,
      list: `${ROOTS.DASHBOARD}/pricelists/list`,
      new: `${ROOTS.DASHBOARD}/pricelists/new`,
    },
    buyers: {
      root: `${ROOTS.DASHBOARD}/buyers`,
    },
    contracts: {
      root: `${ROOTS.DASHBOARD}/contracts`,
      new: `${ROOTS.DASHBOARD}/contracts/new`,
    },
    transactions: {
      root: `${ROOTS.DASHBOARD}/transactions`,
      list: `${ROOTS.DASHBOARD}/transactions/list`,
    },
    loans: {
      root: `${ROOTS.DASHBOARD}/loans`,
      list: `${ROOTS.DASHBOARD}/loans/list`,
      repayments: `${ROOTS.DASHBOARD}/loans/repayments`,
    },
    cashflow: {
      root: `${ROOTS.DASHBOARD}/cashflow`,
    },
    portfolio: {
      root: `${ROOTS.DASHBOARD}/portfolio`,
      list: `${ROOTS.DASHBOARD}/portfolio/list`,
    },
    reports: {
      root: `${ROOTS.DASHBOARD}/reports`,
    },
    cooperative: {
      members: `${ROOTS.DASHBOARD}/cooperative/members`,
      branches: `${ROOTS.DASHBOARD}/cooperative/branches`,
      sectors: `${ROOTS.DASHBOARD}/cooperative/sectors`,
      compliance: `${ROOTS.DASHBOARD}/cooperative/compliance`,
      apiClients: `${ROOTS.DASHBOARD}/cooperative/api-clients`,
      appAuthorizations: `${ROOTS.DASHBOARD}/cooperative/app-authorizations`,
    },
    admin: {
      cooperatives: `${ROOTS.DASHBOARD}/admin/cooperatives`,
      counties: `${ROOTS.DASHBOARD}/admin/counties`,
      sectors: `${ROOTS.DASHBOARD}/admin/sectors`,
    },
    my: {
      farms: `${ROOTS.DASHBOARD}/my/farms`,
      deliveries: `${ROOTS.DASHBOARD}/my/deliveries`,
      payments: `${ROOTS.DASHBOARD}/my/payments`,
    },
    // DEPRECATED: Legacy template paths - will be removed in future version
    customer: {
      root: `${ROOTS.DASHBOARD}/customer`,
      new: `${ROOTS.DASHBOARD}/customer/new`,
      list: `${ROOTS.DASHBOARD}/customer/list`,
      cards: `${ROOTS.DASHBOARD}/customer/cards`,
      profile: `${ROOTS.DASHBOARD}/customer/profile`,
      account: `${ROOTS.DASHBOARD}/customer/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/customer/${id}/edit`,
      edit2: (id: string) => `${ROOTS.DASHBOARD}/customer/${id}/account`,
      demo: { edit: `${ROOTS.DASHBOARD}/customer/${MOCK_ID}/edit` },
    },
    package: {
      root: `${ROOTS.DASHBOARD}/package`,
      new: `${ROOTS.DASHBOARD}/package/new`,
      list: `${ROOTS.DASHBOARD}/package/list`,
      cards: `${ROOTS.DASHBOARD}/package/cards`,
      profile: `${ROOTS.DASHBOARD}/package/profile`,
      account: `${ROOTS.DASHBOARD}/package/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/package/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/package/${MOCK_ID}/edit` },
    },
    voucher: {
      root: `${ROOTS.DASHBOARD}/voucher`,
      new: `${ROOTS.DASHBOARD}/voucher/new`,
      list: `${ROOTS.DASHBOARD}/voucher/list`,
      cards: `${ROOTS.DASHBOARD}/voucher/cards`,
      profile: `${ROOTS.DASHBOARD}/voucher/profile`,
      account: `${ROOTS.DASHBOARD}/voucher/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/voucher/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/voucher/${MOCK_ID}/edit` },
    },
    equipment: {
      root: `${ROOTS.DASHBOARD}/equipment`,
      new: `${ROOTS.DASHBOARD}/equipment/new`,
      list: `${ROOTS.DASHBOARD}/equipment/list`,
      cards: `${ROOTS.DASHBOARD}/equipment/cards`,
      profile: `${ROOTS.DASHBOARD}/equipment/profile`,
      account: `${ROOTS.DASHBOARD}/equipment/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/equipment/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/equipment/${MOCK_ID}/edit` },
    },
    payment: {
      root: `${ROOTS.DASHBOARD}/payment`,
      new: `${ROOTS.DASHBOARD}/payment/new`,
      list: `${ROOTS.DASHBOARD}/payment/list`,
      cards: `${ROOTS.DASHBOARD}/payment/cards`,
      profile: `${ROOTS.DASHBOARD}/payment/profile`,
      account: `${ROOTS.DASHBOARD}/payment/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/payment/${id}/edit`,
      demo: { edit: `${ROOTS.DASHBOARD}/payment/${MOCK_ID}/edit` },
    },
    leave: {
      root: `${ROOTS.DASHBOARD}/leave`,
      new: `${ROOTS.DASHBOARD}/leave/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/leave/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/leave/${id}/edit`,
      balances: `${ROOTS.DASHBOARD}/leave/balances`,
      demo: {
        details: `${ROOTS.DASHBOARD}/leave/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/leave/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}`,
      edit: (title: string) =>
        `${ROOTS.DASHBOARD}/post/${kebabCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: { details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}` },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
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
