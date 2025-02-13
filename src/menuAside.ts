import { mdiAccountCircle, mdiMonitor, mdiTable } from '@mdi/js'
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    icon: mdiTable,
  },
  {
    href: '/products/products-list',
    label: 'Products',
    icon: mdiTable,
  },
  {
    href: '/agency_types/agency_types-list',
    label: 'Agency types',
    icon: mdiTable,
  },
  {
    href: '/deal_types/deal_types-list',
    label: 'Deal types',
    icon: mdiTable,
  },
  {
    href: '/property_types/property_types-list',
    label: 'Property types',
    icon: mdiTable,
  },
  {
    href: '/product_parameters/product_parameters-list',
    label: 'Product parameters',
    icon: mdiTable,
  },
  {
    href: '/product_parameter_items/product_parameter_items-list',
    label: 'Product parameter items',
    icon: mdiTable,
  },
  {
    href: '/city_areas/city_areas-list',
    label: 'City areas',
    icon: mdiTable,
  },
  {
    href: '/cities/cities-list',
    label: 'Cities',
    icon: mdiTable,
  },
  {
    href: '/regions/regions-list',
    label: 'Regions',
    icon: mdiTable,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle,
  },
  {
    href: '/api-docs',
    label: 'Swagger API',
    icon: mdiAccountCircle,
  },
]

export default menuAside
