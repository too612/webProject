import client from '../api/api.client';
import type { ApiResponse } from '../api/api.types';
import { getApiErrorMessage } from '../api/apiError';
import type { ChatbotReply } from './chatbotModel';

export const chatbotApi = {
  async sendMessage(message: string): Promise<ChatbotReply> {
    try {
      const response = await client.post<ApiResponse<ChatbotReply>>('/common/chatbot/message', { message });
      return response.data.data ?? { reply: '죄송해요, 잠시 후 다시 시도해 주세요.' };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, '답변을 불러오지 못했습니다.'));
    }
  },
};
