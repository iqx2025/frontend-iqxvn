'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Use the production-ready version
const N8nChatProd = dynamic(() => import('./N8nChatProd'), {
  ssr: false,
  loading: () => null,
});

export default function ChatWrapper() {
  return (
    <Suspense fallback={null}>
      <N8nChatProd />
    </Suspense>
  );
}
