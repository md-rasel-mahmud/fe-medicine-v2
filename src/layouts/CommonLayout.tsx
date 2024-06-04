import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import { CommonLayoutProps } from '../types/layouts/CommonLayout';

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  return (
    <>
      <Sidebar>{children || <Outlet />}</Sidebar>
    </>
  );
};

export default CommonLayout;
