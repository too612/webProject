export interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
  menuPath?: string;
}

export interface ChatbotReply {
  reply: string;
  suggestions?: string[];
  menuPath?: string;
}
