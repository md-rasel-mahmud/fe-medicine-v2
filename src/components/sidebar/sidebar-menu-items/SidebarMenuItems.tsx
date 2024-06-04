import { Home, Info } from '@mui/icons-material';

export type SidebarMenuItem = {
  label: string;
  icon: JSX.Element;
  path?: string;
  id: string;
  moduleTitle?: string;
  children?: SidebarMenuItem[];
};

const sidebarMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    icon: <Home />,
    id: 'home',
    moduleTitle: 'Dashboard Module',
    children: [
      {
        label: 'Home',
        icon: <Home />,
        path: '/',
        id: 'home',
      },
      {
        label: 'Home',
        icon: <Home />,
        path: '/',
        id: 'home',
      },
    ],
  },
  {
    label: 'About',
    icon: <Info />,
    path: '/about',
    id: 'about',
  },
  {
    label: 'Stock',
    icon: <Info />,
    path: '/stock',
    id: 'stock',
  },
];

export default sidebarMenuItems;
