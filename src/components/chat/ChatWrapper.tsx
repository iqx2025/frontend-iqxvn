'use client';

import dynamic from 'next/dynamic';

const N8nChat = dynamic(() => import('./N8nChat'), {
  ssr: false,
});

export default function ChatWrapper() {
  return <N8nChat />;
}
