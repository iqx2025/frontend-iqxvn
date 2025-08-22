'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Define proper types for n8n chat config
interface N8nChatConfig {
  webhookUrl: string;
  target: string;
  mode: 'window' | 'fullscreen';
  chatInputKey: string;
  chatSessionKey: string;
  metadata: Record<string, unknown>;
  initialMessages: string[];
  i18n: {
    en: {
      title: string;
      subtitle: string;
      footer: string;
      getStarted: string;
      inputPlaceholder: string;
      closeButtonTooltip: string;
    };
  };
  theme: {
    primaryColor: string;
    chatWindowBackgroundColor: string;
    chatMessagesBackgroundColor: string;
    chatInputBackgroundColor: string;
    chatInputTextColor: string;
    chatTextColor: string;
    userMessageBackgroundColor: string;
    userMessageTextColor: string;
    aiMessageBackgroundColor: string;
    aiMessageTextColor: string;
    aiThinkingAnimationColor: string;
  };
}

declare global {
  interface Window {
    n8nChatConfig?: N8nChatConfig;
  }
}

export default function N8nChatScript() {
  useEffect(() => {
    // Ensure window.n8nChat is available globally
    if (typeof window !== 'undefined') {
      window.n8nChatConfig = {
        webhookUrl: 'https://ai.iqx.vn/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat',
        target: '#n8n-chat-widget',
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
      };
    }
  }, []);

  return (
    <>
      <div id="n8n-chat-widget" style={{ position: 'fixed', zIndex: 9999 }} />
      <Script
        id="n8n-chat-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Wait for the n8n chat library to be available
              function loadN8nChat() {
                if (typeof window !== 'undefined' && window.n8nChatConfig) {
                  import('@n8n/chat').then(({ createChat }) => {
                    try {
                      createChat(window.n8nChatConfig);
                      console.log('n8n chat initialized via script');
                    } catch (error) {
                      console.error('Failed to initialize n8n chat:', error);
                    }
                  }).catch(error => {
                    console.error('Failed to import n8n chat:', error);
                  });
                }
              }

              // Try to load immediately if possible
              if (document.readyState === 'complete') {
                setTimeout(loadN8nChat, 100);
              } else {
                window.addEventListener('load', function() {
                  setTimeout(loadN8nChat, 100);
                });
              }
            })();
          `,
        }}
      />
    </>
  );
}
