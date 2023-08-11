import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiPalette,
  mdiVuejs,
} from '@mdi/js';
import { MenuAsideItem } from './interfaces';

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
    href: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle,
  },
  {
    href: '/api-docs',
    label: 'Swagger API',
    icon: mdiAccountCircle,
  },
];

export default menuAside;
