import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import './index.css';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPublishableKey) throw new Error('VITE_CLERK_PUBLISHABLE_KEY est manquante.');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </ClerkProvider>
  </StrictMode>,
);
