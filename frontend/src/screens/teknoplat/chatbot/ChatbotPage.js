import { Box, Divider, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ChatbotPageThread from './ChatbotPage.Thread';
import ChatbotPageSetting from './ChatbotPage.Setting';
import ChatbotService from '../../../services/ChatbotService';
import { useOutletContext } from 'react-router-dom';

export default function ChatbotPage() {
  const { user } = useOutletContext();

  const tabOptions = [
    { value: 0, name: 'Chatbot' },
    { value: 1, name: 'Settings' },
  ];

  const [chatbot, setChatbot] = useState(null);

  useEffect(() => {
    (async () => {
      const account = localStorage.getItem('account');

      try {
        let chatbotResponse = await ChatbotService.fetchChatbotThread(
          user.user_id
        );
        if (chatbotResponse.data.length === 0) {
          chatbotResponse = await ChatbotService.initiateChatbotThread(
            user.user_id
          );
        }
        setChatbot(chatbotResponse.data[0]);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user]);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, value) => {
    setTabValue(value);
  };

  return (
    <Box p={3}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="action-tabs"
      >
        {tabOptions.map((option) => (
          <Tab
            key={option.value}
            id={`option-${option.value}`}
            label={option.name}
            aria-controls={`tabpanel-${option.value}`}
          />
        ))}
      </Tabs>
      <Divider />
      {tabValue === 0 && <ChatbotPageThread chatbot={chatbot} />}
      {tabValue === 1 && <ChatbotPageSetting />}
    </Box>
  );
}
