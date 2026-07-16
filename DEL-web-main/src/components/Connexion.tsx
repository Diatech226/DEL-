import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/react';
import { Construction } from 'lucide-react';
import { useState } from 'react';

interface ConnexionProps { onLoginSuccess: () => void; onNavigate: (screen: string) => void; }

type AuthMode = 'sign-in' | 'sign-up';

const clerkAppearance = {
  elements: {
    cardBox: 'shadow-none',
    card: 'shadow-none',
    footerActionLink: 'text-amber-600 hover:text-amber-700',
    formButtonPrimary: 'bg-amber-500 hover:bg-amber-400 text-gray-950',
    socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
  },
};

export default function Connexion({ onLoginSuccess, onNavigate }: ConnexionProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('sign-in');

  return (
    <div className="flex-1 bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden" id="screen-connexion">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1),transparent_50%)]" />
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20"><Construction className="h-7 w-7" /></div>
          <h2 className="font-sans text-xl font-black text-white">Connexion à l'Espace DEL-web</h2>
          <p className="text-xs text-gray-400">Authentification sécurisée par Clerk : email, inscription et Google si activé dans le dashboard Clerk.</p>
        </div>
        <SignedOut>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-900 p-1">
            <button
              type="button"
              onClick={() => setAuthMode('sign-in')}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${authMode === 'sign-in' ? 'bg-amber-500 text-gray-950' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('sign-up')}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${authMode === 'sign-up' ? 'bg-amber-500 text-gray-950' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              Inscription
            </button>
          </div>
          <div className="rounded-2xl bg-white p-2">
            {authMode === 'sign-in' ? (
              <SignIn routing="hash" signUpUrl="#/sign-up" appearance={clerkAppearance} />
            ) : (
              <SignUp routing="hash" signInUrl="#/sign-in" appearance={clerkAppearance} />
            )}
          </div>
        </SignedOut>
        <SignedIn>
          <div className="rounded-xl border border-green-900/50 bg-green-950/40 p-4 text-center text-sm font-bold text-green-200">Session Clerk active. Votre utilisateur DEL est synchronisé automatiquement.</div>
          <div className="flex justify-center"><UserButton /></div>
          <button onClick={() => { onLoginSuccess(); onNavigate('Dashboard Propriétaire Personnalisé - DEL-web'); }} className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-gray-950 hover:bg-amber-400">Continuer vers DEL-web</button>
        </SignedIn>
      </div>
    </div>
  );
}
