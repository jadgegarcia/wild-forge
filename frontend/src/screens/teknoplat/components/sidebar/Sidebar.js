import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useNavigate, useOutletContext } from 'react-router-dom';
import GLOBALS from '../../../../app_globals';

function Sidebar() {
  const { classMember, classId } = useOutletContext();
  const navigate = useNavigate();

  const handleMeetingsClick = () => {
    navigate('meetings');
  };

  const handlePitchesClick = () => {
    localStorage.setItem('meetingsPageTabValue', 3);
    window.location.href = `/classes/${classId}/teknoplat`;
  };

  const handleChatbotClick = () => {
    navigate('chatbot');
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      aria-label="teknoplat links"
    >
      <Drawer
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
        variant="permanent"
        anchor="right"
      >
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleMeetingsClick}>
              <ListItemText primary="Meetings" />
            </ListItemButton>
          </ListItem>
          {classMember.role === GLOBALS.CLASSMEMBER_ROLE.STUDENT && (
            <ListItem disablePadding>
              <ListItemButton onClick={handlePitchesClick}>
                <ListItemText primary="My Pitch" />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton onClick={handleChatbotClick}>
              <ListItemText primary="Chatbot" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
