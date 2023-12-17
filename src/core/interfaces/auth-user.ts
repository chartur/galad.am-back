export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  password: string;
  isActive?: boolean;
  image?: string;
  created_at: Date;
  updated_at: Date;
}
