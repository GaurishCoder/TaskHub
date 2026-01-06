export interface User {
  userId: string;
  email: string;
  username?: string;
}

export interface AuthResponse {
  message: string;
  userData: User;
  token: string;
}

export interface VerifyResponse {
  message: string;
  authenticated: boolean;
  tokenPresent: boolean;
  userData?: User;
}