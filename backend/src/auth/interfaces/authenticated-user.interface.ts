export interface AuthenticatedUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
}
