import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarCollapsePropType } from '../../types/components/sidebar/SidebarCollapsePropType';

const SidebarCollapse: FC<SidebarCollapsePropType> = ({
  collapseData,
  open,
}) => {
  const [listItemOpen, setListItemOpen] = useState(false);

  const handleListItemToggle = () => {
    setListItemOpen(!listItemOpen);
  };
  return (
    <>
      <ListItem sx={{ display: open ? 'block' : 'none' }}>
        <Typography variant='body2' color='text.secondary' fontWeight='bold'>
          {collapseData.moduleTitle}
        </Typography>
      </ListItem>

      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          onClick={handleListItemToggle}
          {...(collapseData.path && {
            component: Link,
            to: collapseData.path,
          })}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {collapseData.icon}
          </ListItemIcon>
          <ListItemText
            primary={
              collapseData.label.length > 12
                ? collapseData.label.slice(0, 12) + '...'
                : collapseData.label
            }
            sx={{ opacity: open ? 1 : 0 }}
          />
          {listItemOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>

      {collapseData.children &&
        collapseData.children.map((childMenuItem, index) => (
          <Collapse key={index} in={listItemOpen} timeout='auto' unmountOnExit>
            <List disablePadding>
              <ListItemButton
                {...{
                  component: Link,
                  to: childMenuItem.path,
                  sx: { pl: 4 },
                }}
              >
                <ListItemIcon>{childMenuItem.icon}</ListItemIcon>
                <ListItemText primary={childMenuItem.label} />
              </ListItemButton>
            </List>
          </Collapse>
        ))}
    </>
  );
};

export default SidebarCollapse;
