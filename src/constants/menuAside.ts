import {
  mdiAccountCircle,
  mdiTable,
  mdiHandshake,
  mdiShape,
  mdiMapMarker,
  mdiCityVariant,
  mdiHome,
  mdiViewDashboard,
  mdiSquareEditOutline,
  mdiViewList,
  mdiChat,
} from '@mdi/js'
import { MenuAsideItem } from '@/interfaces'
import { Permission } from '@/constants/permissions'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: mdiViewDashboard,
    label: 'Dashboard',
    permission: Permission.VIEW_DASHBOARD,
  },

  {
    label: 'Agency Types',
    icon: mdiTable,
    permission: Permission.VIEW_PRODUCTS,
    menu: [
      {
        href: '/agency_types/agency_types-list',
        label: 'Agency Types List',
        icon: mdiViewList,
        permission: Permission.VIEW_PRODUCTS,
      },
      {
        href: '/products/products-new',
        label: 'Create Product',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_PRODUCT,
      },
    ],
  },
  {
    label: 'Users',
    icon: mdiAccountCircle,
    permission: Permission.VIEW_USERS,
    menu: [
      {
        href: '/users/users-list',
        label: 'Users List',
        icon: mdiViewList,
        permission: Permission.VIEW_USERS,
      },
      // {
      //   href: '/users/moderators',
      //   label: 'Moderator List',
      //   icon: mdiViewList,
      //   permission: Permission.VIEW_MODERATORS,
      // },
      {
        href: '/users/users-new',
        label: 'Create User',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_USER,
      },
    ],
  },
  {
    label: 'Products',
    icon: mdiTable,
    permission: Permission.VIEW_PRODUCTS,
    menu: [
      {
        href: '/products/products-list',
        label: 'Products List',
        icon: mdiViewList,
        permission: Permission.VIEW_PRODUCTS,
      },
      {
        href: '/products/products-new',
        label: 'Create Product',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_PRODUCT,
      },
    ],
  },

  {
    label: 'Deal Types',
    icon: mdiHandshake,
    permission: Permission.VIEW_DEAL_TYPES,
    menu: [
      {
        href: '/deal_types/deal_types-list',
        label: 'Deal Types List',
        icon: mdiViewList,
        permission: Permission.VIEW_DEAL_TYPES,
      },
      {
        href: '/deal_types/deal_types-new',
        label: 'Create Deal Type',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_DEAL_TYPE,
      },
    ],
  },

  {
    label: 'Property Types',
    icon: mdiShape,
    permission: Permission.VIEW_PROPERTY_TYPES,
    menu: [
      {
        href: '/property_types/property_types-list',
        label: 'Property Types List',
        icon: mdiViewList,
        permission: Permission.VIEW_PROPERTY_TYPES,
      },
      {
        href: '/property_types/property_types-new',
        label: 'Create Property Type',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_PROPERTY_TYPE,
      },
    ],
  },

  {
    label: 'Product Parameters',
    icon: mdiTable,
    permission: Permission.VIEW_PRODUCTS,
    menu: [
      {
        href: '/product_parameters/product_parameters-list',
        label: 'Parameters List',
        icon: mdiViewList,
        permission: Permission.VIEW_PRODUCTS_PARAMS,
      },
      {
        href: '/product_parameters/product-parameter-new',
        label: 'Create Product',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_PRODUCT_PARAM,
      },
    ],
  },

  // {
  //   label: 'Product Parameter Items',
  //   icon: mdiTable,
  //   permission: Permission.VIEW_PRODUCTS_PARAM_ITEMS,
  //   menu: [
  //     {
  //       href: '/product_parameter_items/product_parameter_items-list',
  //       label: 'Parameters List',
  //       icon: mdiViewList,
  //       permission: Permission.VIEW_PRODUCTS,
  //     },
  //   ],
  // },

  {
    label: 'Regions',
    icon: mdiMapMarker,
    permission: Permission.VIEW_REGIONS,
    menu: [
      {
        href: '/regions/regions-list',
        label: 'Regions List',
        icon: mdiViewList,
        permission: Permission.VIEW_REGIONS,
      },
      {
        href: '/regions/regions-new',
        label: 'Create Region',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_REGION,
      },
    ],
  },

  {
    label: 'Cities',
    icon: mdiCityVariant,
    permission: Permission.VIEW_CITIES,
    menu: [
      {
        href: '/cities/cities-list',
        label: 'Cities List',
        icon: mdiViewList,
        permission: Permission.VIEW_CITIES,
      },
      {
        href: '/cities/cities-new',
        label: 'Create City',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_CITY,
      },
    ],
  },

  {
    label: 'City Areas',
    icon: mdiHome,
    permission: Permission.VIEW_CITY_AREAS,
    menu: [
      {
        href: '/city_areas/city_areas-list',
        label: 'City Areas List',
        icon: mdiViewList,
        permission: Permission.VIEW_CITY_AREAS,
      },
      {
        href: '/city_areas/city_areas-new',
        label: 'Create City Area',
        icon: mdiSquareEditOutline,
        permission: Permission.CREATE_CITY_AREA,
      },
    ],
  },

  {
    href: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle,
  },
  {
    // href: '/chat-requests/chat-requests-list',
    href: '/chats',
    label: 'Chats',
    icon: mdiChat,
  },
  {
    href: '/chat-requests',
    label: 'Chats requests',
    icon: mdiChat,
  },

  // {
  //   href: '/api-docs',
  //   label: 'Swagger API',
  //   icon: mdiMonitor,
  //   permission: Permission.VIEW_SETTINGS,
  // },
]

export default menuAside
