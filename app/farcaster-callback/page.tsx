import { Suspense } from 'react';
import FarcasterCallbackClient from './CallbackClient';

export default function FarcasterCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <FarcasterCallbackClient />
    </Suspense>
  );
}