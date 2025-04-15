export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional since we don't always want to expose it
}

export interface UserSession {
  user: User;
  expires: string;
}
