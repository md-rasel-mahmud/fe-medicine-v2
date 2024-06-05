export type SidebarMenuItem = {
  label: string;
  icon: JSX.Element;
  path?: string;
  id: string;
  moduleTitle?: string;
  children?: SidebarMenuItem[];
};
