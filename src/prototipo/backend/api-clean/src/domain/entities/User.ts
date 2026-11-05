export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserCredentials extends User {
  passwordHash: string;
}
