'use client';

import { useEffect, useState, useRef } from 'react';

declare global {
  interface Window {
    n8nChatInstance?: any;
    n8nChatConfig?: any;
  }
}

export default function N8nChatProd() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attemptedRef = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    // Only run on client side
    if (typeof window === 'undefined') return;

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000;

    const initializeChat = async () => {
      try {
        // Load the CSS first
        if (!document.querySelector('link[href*="@n8n/chat/style.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '/_next/static/css/@n8n/chat/style.css';
          document.head.appendChild(link);
        }

        // Wait a bit for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 500));

        // Dynamically import the chat module
        const chatModule = await import('@n8n/chat');
        
        if (!chatModule || !chatModule.createChat) {
          throw new Error('Chat module not properly loaded');
        }

        // Check if container exists
        if (!chatContainerRef.current) {
          throw new Error('Chat container not found');
        }

        // Initialize the chat
        const chatInstance = chatModule.createChat({
          webhookUrl: 'https://ai.iqx.vn/webhook/e104e40e-6134-4825-a6f0-8a646d882662/chat',
          target: chatContainerRef.current,
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

        // Store instance globally for debugging
        if (typeof window !== 'undefined') {
          window.n8nChatInstance = chatInstance;
        }

        setIsLoaded(true);
        console.log('✅ n8n chat initialized successfully');
      } catch (err) {
        console.error('❌ Failed to initialize n8n chat:', err);
        
        // Retry logic
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying chat initialization (${retryCount}/${maxRetries})...`);
          setTimeout(initializeChat, retryDelay * retryCount);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load chat');
        }
      }
    };

    // Initialize based on document ready state
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // DOM is ready
      setTimeout(initializeChat, 100);
    } else {
      // Wait for DOM to be ready
      const handleLoad = () => {
        setTimeout(initializeChat, 100);
      };
      window.addEventListener('DOMContentLoaded', handleLoad);
      
      return () => {
        window.removeEventListener('DOMContentLoaded', handleLoad);
      };
    }
  }, []);

  return (
    <>
      <div 
        ref={chatContainerRef}
        id="n8n-chat-container" 
        style={{ 
          position: 'fixed', 
          zIndex: 9999,
          bottom: 0,
          right: 0,
        }} 
      />
      
      {/* Hidden status indicator for debugging */}
      <div 
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          fontSize: '10px',
          color: 'transparent',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        data-chat-status={isLoaded ? 'loaded' : 'loading'}
        data-chat-error={error || ''}
      >
        {isLoaded ? '✓' : '○'}
      </div>
    </>
  );
}
