'use client';

import { useEffect } from 'react';
import '@n8n/chat/style.css';

export default function N8nChat() {
  useEffect(() => {
    // Dynamically import the chat widget to avoid SSR issues
    const loadChat = async () => {
      const { createChat } = await import('@n8n/chat');
      
      createChat({
        webhookUrl: 'https://ai.iqx.vn/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat',
        target: '#n8n-chat',
        mode: 'window',
        chatInputKey: 'chatInput',
        chatSessionKey: 'chatSession',
        metadata: {},
        initialMessages: [
          'Xin chào! Tôi là trợ lý AI của IQX. Tôi có thể giúp bạn về thông tin chứng khoán, phân tích tài chính, và tin tức thị trường. Bạn cần hỗ trợ gì?'
        ],
        i18n: {
          en: {
            title: 'IQX AI Assistant',
            subtitle: 'Powered by n8n',
            footer: '',
            getStarted: 'Bắt đầu chat',
            inputPlaceholder: 'Nhập tin nhắn...',
          }
        },
        theme: {
          primaryColor: '#4F46E5',
          chatWindowBackgroundColor: '#ffffff',
          chatMessagesBackgroundColor: '#f9fafb',
          chatInputBackgroundColor: '#ffffff',
          chatInputTextColor: '#111827',
          chatTextColor: '#111827',
          userMessageBackgroundColor: '#4F46E5',
          userMessageTextColor: '#ffffff',
          aiMessageBackgroundColor: '#e5e7eb',
          aiMessageTextColor: '#111827',
          aiThinkingAnimationColor: '#4F46E5',
        }
      });
    };

    loadChat();
  }, []);

  return <div id="n8n-chat" />;
}
