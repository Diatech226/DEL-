/// <reference types="vite/client" />

declare module '@clerk/react' {
  export const ClerkProvider: any;
  export const SignedIn: any;
  export const SignedOut: any;
  export const SignIn: any;
  export const SignUp: any;
  export const UserButton: any;
  export const SignInButton: any;
  export const SignUpButton: any;
  export function useAuth(): any;
  export function useUser(): any;
  export function useClerk(): any;
}
