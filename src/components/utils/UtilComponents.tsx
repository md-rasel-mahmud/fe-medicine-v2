import { Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

const UtilComponents = () => {
  return (
    <>
      <Typography variant='h1'>Util Components</Typography>
      <Outlet />
    </>
  );
};

export default UtilComponents;
