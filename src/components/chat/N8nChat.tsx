'use client';

import { useEffect, useState } from 'react';
import '@n8n/chat/style.css';

export default function N8nChat() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadChat();
    }, 100);

    // Dynamically import the chat widget to avoid SSR issues
    const loadChat = async () => {
      try {
        console.log('Loading n8n chat widget...');
        
        const { createChat } = await import('@n8n/chat');
        
        // Check if target element exists
        const targetElement = document.getElementById('n8n-chat');
        if (!targetElement) {
          console.error('n8n-chat element not found');
          setError('Chat container not found');
          return;
        }

        createChat({
          webhookUrl: 'https://ai.iqx.vn/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat',
          target: '#n8n-chat',
          mode: 'window',
          chatInputKey: 'chatInput',
          chatSessionKey: 'sessionId',
          metadata: {},
          initialMessages: [
            'Xin chào! Tôi là trợ lý AI của IQX. Tôi có thể giúp bạn về thông tin chứng khoán, phân tích tài chính, và tin tức thị trường. Bạn cần hỗ trợ gì?'
          ],
          i18n: {
            en: {
              title: 'IQX',
              subtitle: 'Powered by iqx.vn',
              footer: '',
              getStarted: 'Bắt đầu chat',
              inputPlaceholder: 'Nhập tin nhắn...',
              closeButtonTooltip: 'Đóng chat',
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
        
        setIsLoaded(true);
        console.log('n8n chat widget loaded successfully');
      } catch (err) {
        console.error('Failed to load n8n chat:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chat');
      }
    };

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Add debug info in development
  if (process.env.NODE_ENV === 'development' && error) {
    console.error('N8nChat Error:', error);
  }

  return (
    <>
      <div id="n8n-chat" style={{ position: 'fixed', zIndex: 9999 }} />
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ display: 'none' }}>
          Chat loaded: {isLoaded ? 'Yes' : 'No'}
          {error && ` | Error: ${error}`}
        </div>
      )}
    </>
  );
}
