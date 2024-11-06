import axios from 'axios';
import apiConfig from './config';
import { api } from './axiosConfig';

/// TODO: change this if okay na
const BASE_URL = `${apiConfig.API_URL}/idea_validation`;

const ChatbotService = {
  fetchChatbotThread: async (account) =>
    await api.get(`${BASE_URL}?account=${account}`),
  initiateChatbotThread: async (account) => {
    const data = {
      user: account,
    };
    const response = await api.post(`${BASE_URL}`, data);
    return response;
  },
  addNewChatToChatbot: async (chatbotId, payload) => {
    const data = {
      chatbot: chatbotId,
      role: 'user',
      content: payload.content,
      leniency: payload.leniency,
      generality: payload.generality,
      optimism: payload.optimism,
    };
    const response = await api.post(
      `${BASE_URL}/${chatbotId}/send_message`,
      data
    );
    return response;
  },
};

export default ChatbotService;
