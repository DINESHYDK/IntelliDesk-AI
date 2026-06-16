// ============================================================================
// SEARCH: AUTH_SESSION_PROVIDER
// IntelliDesk AI - NextAuth SessionProvider wrapper (client component)
// Required so next-auth/react hooks (signIn, useSession) work in client components
// ============================================================================

'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
