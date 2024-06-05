import { Home, Info } from '@mui/icons-material';
import { SidebarMenuItem } from '../../../types/components/sidebar/sidebar-menu-items/SidebarMenuItemsType';

const sidebarMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    icon: <Home />,
    id: 'home',
    moduleTitle: 'Dashboard Module',
    children: [
      {
        label: 'Dashboard-1',
        icon: <Home />,
        path: '/',
        id: 'dashboard-1',
      },
      {
        label: 'Dashboard-2',
        icon: <Home />,
        path: '/',
        id: 'dashboard-2',
      },
    ],
  },
  {
    label: 'Medicine',
    icon: <Info />,
    path: '/medicine',
    id: 'medicine',
  },
  {
    label: 'Stock',
    icon: <Info />,
    path: '/stock',
    id: 'stock',
  },
  {
    label: 'Utils',
    icon: <Info />,
    moduleTitle: 'Util Components',
    id: 'util-components',
    children: [
      {
        label: 'Form',
        icon: <Info />,
        path: '/util-components/form',
        id: 'form',
      },
    ],
  },
];

export default sidebarMenuItems;
