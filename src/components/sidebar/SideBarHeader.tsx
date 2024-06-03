import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const SideBarHeader: FC = () => {
  return (
    <DrawerHeader>
      <Typography color='primary' variant='h6' paddingLeft={2}>
        Medicine{' '}
      </Typography>
    </DrawerHeader>
  );
};

export default SideBarHeader;
