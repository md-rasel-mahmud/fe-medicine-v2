import { FC } from 'react';
import Sidebar from '../components/sidebar/Sidebar';

const CommonLayout: FC = () => {
  return (
    <>
      <Sidebar>
        <div>Home</div>
      </Sidebar>
    </>
  );
};

export default CommonLayout;
