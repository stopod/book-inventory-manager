export interface UserDTO {
  id: string;
  email: string;
  name?: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
