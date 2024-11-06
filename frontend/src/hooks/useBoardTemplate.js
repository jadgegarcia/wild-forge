import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpringBoardService from '../services/SpringBoardService';

const useBoardTemplate = () => {
  const getAllTemplate = async () => {
    try {
      const res = await SpringBoardService.getAllTemplate();
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error?.response?.status };
    }
  };
  const getTemplate = async (tempId) => {
    try {
      const res = await SpringBoardService.getTemplate(tempId);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error?.response?.status };
    }
  };

  return { getAllTemplate, getTemplate };
};

export default useBoardTemplate;
