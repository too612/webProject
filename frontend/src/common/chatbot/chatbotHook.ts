import { useCallback, useState } from 'react';
import { chatbotApi } from './chatbotApi';
import type { ChatMessage, ChatbotReply } from './chatbotModel';

const INITIAL_MESSAGE: ChatMessage = {
  role: 'bot',
  text: '안녕하세요. 궁금한 점을 물어보세요. 예) 예배시간, 오시는 길, 담임목사, 공지사항',
};

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(async (text: string): Promise<ChatbotReply | null> => {
    if (!text.trim()) {
      return null;
    }
    setIsSending(true);
    try {
      const reply = await chatbotApi.sendMessage(text);
      setMessages((prev) => [
        ...prev,
        { role: 'user', text },
        { role: 'bot', text: reply.reply, menuPath: reply.menuPath },
      ]);
      return reply;
    } catch (e) {
      const message = e instanceof Error ? e.message : '답변을 불러오지 못했습니다.';
      setMessages((prev) => [
        ...prev,
        { role: 'user', text },
        { role: 'bot', text: message },
      ]);
      return null;
    } finally {
      setIsSending(false);
    }
  }, []);

  return { messages, isSending, sendMessage };
}
