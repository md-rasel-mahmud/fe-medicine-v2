import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import CommonLayout from './layouts/CommonLayout';

const App: FC = () => {
  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </>
  );
};

export default App;
