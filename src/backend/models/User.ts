export interface User {
  id?: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  role: 'USER' | 'ADMIN';
}
